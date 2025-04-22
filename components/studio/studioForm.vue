<template>
  <v-app>
    <v-main class="w-100 h-100 overflow-hidden d-flex">
      <div class="control-panel" style="width: 350px;">
        <v-card flat class="fill-height">
          <div class="px-4 py-2 d-flex align-center">
            <v-chip color="success" prepend-icon="mdi-vuejs" size="small" class="mr-2 px-4 py-2">Vue.js</v-chip>
            <v-chip color="info" prepend-icon="mdi-vuetify" size="small" class="mr-2 px-4 py-2">Vuetify</v-chip>
            <PremiumFeature v-if="!userStore.user.isPremium" premium-link="/subscribe" title="Studio components"
              icon="mdi-palette" type="chip" feature-key="studioComponents" />
          </div>

          <div class="px-4 py-2 d-flex align-center justify-space-between">
            <div>
              <v-chip-group v-model="previewMode" mandatory selected-class="bg-primary text-white">
                <v-chip size="small" value="desktop">
                  <v-icon start size="small">mdi-monitor</v-icon>
                  Desktop
                </v-chip>
                <v-chip size="small" value="tablet">
                  <v-icon start size="small">mdi-tablet</v-icon>
                  Tablet
                </v-chip>
                <v-chip size="small" value="mobile">
                  <v-icon start size="small">mdi-cellphone</v-icon>
                  Mobile
                </v-chip>
              </v-chip-group>
            </div>
          </div>

          <v-tabs v-model="tab" color="primary" align-tabs="center" class="px-4">
            <v-tab value="content">Content</v-tab>
            <v-tab value="style">Style</v-tab>
            <v-tab value="validation">Validation</v-tab>
            <v-tab value="templates">Templates</v-tab>
            <v-tab value="buttons">Buttons</v-tab>
          </v-tabs>

          <v-divider></v-divider>

          <v-card-text class="pa-0 fill-height" style="overflow-y: auto">
            <v-window v-model="tab" class="fill-height">
              <v-window-item value="content">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3 justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon color="primary" class="mr-2">mdi-form-select</v-icon>
                      <span class="text-h6">Form Fields</span>
                    </div>
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-help-circle-outline" variant="text" size="small" v-bind="props"></v-btn>
                      </template>
                      <span>Add, remove and configure form fields</span>
                    </v-tooltip>
                  </div>

                  <v-card class="mb-4 pa-3">
                    <v-text-field v-model="formProperties.title" label="Form Title" variant="outlined"
                      density="comfortable" prepend-inner-icon="mdi-format-title" class="mb-4"></v-text-field>

                    <v-text-field v-model="formProperties.subtitle" label="Form Subtitle (optional)" variant="outlined"
                      density="comfortable" prepend-inner-icon="mdi-format-text" class="mb-4"></v-text-field>

                    <v-switch v-model="formProperties.showGoogleLogin" color="primary" label="Show Google Login Button"
                      hide-details class="mb-2"></v-switch>

                    <v-text-field v-if="formProperties.showGoogleLogin" v-model="formProperties.googleLoginText"
                      label="Google Login Button Text" variant="outlined" density="comfortable"
                      prepend-inner-icon="mdi-google" class="mb-4"></v-text-field>

                    <v-switch v-model="formProperties.showLinkedInLogin" color="primary"
                      label="Show LinkedIn Login Button" hide-details class="mb-2"></v-switch>

                    <v-text-field v-if="formProperties.showLinkedInLogin" v-model="formProperties.linkedInLoginText"
                      label="LinkedIn Login Button Text" variant="outlined" density="comfortable"
                      prepend-inner-icon="mdi-linkedin" class="mb-4"></v-text-field>

                    <v-switch v-model="formProperties.showDivider" color="primary" label="Show Divider" hide-details
                      class="mb-2"></v-switch>

                    <v-text-field v-if="formProperties.showDivider" v-model="formProperties.dividerText"
                      label="Divider Text" variant="outlined" density="comfortable" prepend-inner-icon="mdi-minus"
                      class="mb-4"></v-text-field>

                    <div v-for="(field, index) in formFields" :key="index" class="mb-4">
                      <div class="d-flex align-center justify-space-between mb-2">
                        <span class="text-subtitle-2">Field {{ index + 1 }}</span>
                        <v-btn icon="mdi-delete" color="error" variant="text" density="compact"
                          @click="removeField(index)"></v-btn>
                      </div>

                      <v-select v-model="field.type" :items="fieldTypes" label="Type" variant="outlined"
                        density="compact" prepend-inner-icon="mdi-form-dropdown" class="mb-2"></v-select>

                      <v-text-field v-model="field.label" label="Label" variant="outlined" density="compact"
                        prepend-inner-icon="mdi-label" class="mb-2"></v-text-field>

                      <v-text-field v-model="field.placeholder" label="Placeholder" variant="outlined" density="compact"
                        prepend-inner-icon="mdi-text-box" class="mb-2"></v-text-field>

                      <v-select v-model="field.icon" :items="icons" label="Icon (optional)" variant="outlined"
                        density="compact" prepend-inner-icon="mdi-emoticon" class="mb-2" clearable>
                        <template v-slot:item="{ item, props }">
                          <v-list-item v-bind="props">
                            <template v-slot:prepend>
                              <v-icon :icon="item.raw"></v-icon>
                            </template>
                            <v-list-item-title>{{ item.raw.replace('mdi-', '') }}</v-list-item-title>
                          </v-list-item>
                        </template>
                      </v-select>

                      <v-text-field
                        v-if="field.type === 'select' || field.type === 'radio' || field.type === 'checkbox'"
                        v-model="field.options" label="Options (comma separated)" variant="outlined" density="compact"
                        prepend-inner-icon="mdi-format-list-bulleted" class="mb-2"></v-text-field>

                      <div class="d-flex gap-2">
                        <v-switch v-model="field.required" color="primary" label="Required" hide-details class="mb-2">
                        </v-switch>
                        <v-switch v-if="field.type === 'text'" v-model="field.counter" color="primary" label="Counter"
                          hide-details class="mb-2">
                        </v-switch>
                      </div>
                    </div>

                    <v-btn color="primary" prepend-icon="mdi-plus" variant="tonal" block @click="addField">
                      Add Field
                    </v-btn>
                  </v-card>
                </div>
              </v-window-item>

              <v-window-item value="style">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3 justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon color="primary" class="mr-2">mdi-palette</v-icon>
                      <span class="text-h6">Appearance</span>
                    </div>
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-help-circle-outline" variant="text" size="small" v-bind="props"></v-btn>
                      </template>
                      <span>Customize the visual appearance of form fields</span>
                    </v-tooltip>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Field Variant</label>
                    <v-chip-group v-model="formProperties.variant" mandatory selected-class="bg-primary text-white">
                      <v-chip v-for="variant in fieldVariants" :key="variant" size="small" :value="variant">
                        {{ variant }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Density</label>
                    <v-chip-group v-model="formProperties.density" mandatory selected-class="bg-primary text-white">
                      <v-chip v-for="density in densityOptions" :key="density" size="small" :value="density">
                        {{ density }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <v-switch v-model="formProperties.disabled" color="primary" label="Disabled" hide-details
                    class="mb-2"></v-switch>
                  <v-switch v-model="formProperties.readonly" color="primary" label="Read Only" hide-details
                    class="mb-2"></v-switch>
                  <v-switch v-model="formProperties.persistentPlaceholder" color="primary"
                    label="Persistent Placeholder" hide-details class="mb-4"></v-switch>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Focus color</label>
                    <v-btn-toggle v-model="formProperties.color" mandatory density="comfortable"
                      selected-class="border-primary">
                      <v-btn v-for="color in colors" :key="color.value" :value="color.value"
                        :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                        width="40" height="40" class="ma-1" :class="{ 'bg-grey-lighten-3': color.value === 'default' }">
                        <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-google</v-icon>
                    <span class="text-h6">Google Button Style</span>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Button Variant</label>
                    <v-chip-group v-model="formProperties.googleButtonVariant" mandatory
                      selected-class="bg-primary text-white">
                      <v-chip v-for="variant in buttonVariants" :key="variant" size="small" :value="variant">
                        {{ variant }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Button Color</label>
                    <v-btn-toggle v-model="formProperties.googleButtonColor" mandatory density="comfortable"
                      selected-class="border-primary">
                      <v-btn v-for="color in colors" :key="color.value" :value="color.value"
                        :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                        width="40" height="40" class="ma-1" :class="{ 'bg-grey-lighten-3': color.value === 'default' }">
                        <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Button Size</label>
                    <v-chip-group v-model="formProperties.googleButtonSize" mandatory
                      selected-class="bg-primary text-white">
                      <v-chip v-for="size in ['small', 'default', 'large', 'x-large']" :key="size" size="small"
                        :value="size">
                        {{ size }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <v-switch v-model="formProperties.googleButtonRounded" color="primary" label="Rounded Button"
                    hide-details class="mb-2"></v-switch>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Button Elevation</label>
                    <v-slider v-model="formProperties.googleButtonElevation" min="0" max="24" step="1"
                      thumb-label="always" color="primary"></v-slider>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-linkedin</v-icon>
                    <span class="text-h6">LinkedIn Button Style</span>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Button Variant</label>
                    <v-chip-group v-model="formProperties.linkedInButtonVariant" mandatory
                      selected-class="bg-primary text-white">
                      <v-chip v-for="variant in buttonVariants" :key="variant" size="small" :value="variant">
                        {{ variant }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Button Color</label>
                    <v-btn-toggle v-model="formProperties.linkedInButtonColor" mandatory density="comfortable"
                      selected-class="border-primary">
                      <v-btn v-for="color in colors" :key="color.value" :value="color.value"
                        :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                        width="40" height="40" class="ma-1" :class="{ 'bg-grey-lighten-3': color.value === 'default' }">
                        <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Button Size</label>
                    <v-chip-group v-model="formProperties.linkedInButtonSize" mandatory
                      selected-class="bg-primary text-white">
                      <v-chip v-for="size in ['small', 'default', 'large', 'x-large']" :key="size" size="small"
                        :value="size">
                        {{ size }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <v-switch v-model="formProperties.linkedInButtonRounded" color="primary" label="Rounded Button"
                    hide-details class="mb-2"></v-switch>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Button Elevation</label>
                    <v-slider v-model="formProperties.linkedInButtonElevation" min="0" max="24" step="1"
                      thumb-label="always" color="primary"></v-slider>
                  </div>
                </div>
              </v-window-item>

              <v-window-item value="validation">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
                    <span class="text-h6">Validation</span>
                  </div>

                  <v-switch v-model="formProperties.validateOnBlur" color="primary" label="Validate on Blur"
                    hide-details class="mb-2"></v-switch>
                  <v-switch v-model="formProperties.validateOnInput" color="primary" label="Validate on Input"
                    hide-details class="mb-4"></v-switch>

                  <v-text-field v-model="formProperties.successMessage" label="Success Message" variant="outlined"
                    density="comfortable" prepend-inner-icon="mdi-check" class="mb-4"></v-text-field>

                  <v-text-field v-model="formProperties.errorMessage" label="Error Message" variant="outlined"
                    density="comfortable" prepend-inner-icon="mdi-alert" class="mb-4"></v-text-field>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Message Position</label>
                    <v-chip-group v-model="formProperties.messageLocation" mandatory
                      selected-class="bg-primary text-white">
                      <v-chip v-for="location in messageLocations" :key="location" size="small" :value="location">
                        {{ location }}
                      </v-chip>
                    </v-chip-group>
                  </div>
                </div>
              </v-window-item>

              <v-window-item value="buttons">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-gesture-tap-button</v-icon>
                    <span class="text-h6">Form Buttons</span>
                  </div>

                  <v-card class="mb-4 pa-3">
                    <v-text-field v-model="formProperties.submitButtonText" label="Submit Button Text"
                      variant="outlined" density="comfortable" prepend-inner-icon="mdi-check-circle"
                      class="mb-4"></v-text-field>

                    <v-text-field v-model="formProperties.cancelButtonText" label="Cancel Button Text"
                      variant="outlined" density="comfortable" prepend-inner-icon="mdi-cancel"
                      class="mb-4"></v-text-field>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-2">Submit Button Color</label>
                      <v-btn-toggle v-model="formProperties.submitButtonColor" mandatory density="comfortable"
                        selected-class="border-primary">
                        <v-btn v-for="color in colors" :key="color.value" :value="color.value"
                          :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                          width="40" height="40" class="ma-1"
                          :class="{ 'bg-grey-lighten-3': color.value === 'default' }">
                          <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                        </v-btn>
                      </v-btn-toggle>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-2">Reset Button Color</label>
                      <v-btn-toggle v-model="formProperties.cancelButtonColor" mandatory density="comfortable"
                        selected-class="border-primary">
                        <v-btn v-for="color in colors" :key="color.value" :value="color.value"
                          :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                          width="40" height="40" class="ma-1"
                          :class="{ 'bg-grey-lighten-3': color.value === 'default' }">
                          <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                        </v-btn>
                      </v-btn-toggle>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-2">Button Variant</label>
                      <v-chip-group v-model="formProperties.buttonVariant" mandatory
                        selected-class="bg-primary text-white">
                        <v-chip v-for="variant in buttonVariants" :key="variant" size="small" :value="variant">
                          {{ variant }}
                        </v-chip>
                      </v-chip-group>
                    </div>

                    <v-switch v-model="formProperties.blockButtons" color="primary" label="Full Width Buttons"
                      hide-details class="mb-2"></v-switch>
                  </v-card>
                </div>
              </v-window-item>

              <v-window-item value="templates">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3 justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
                      <span class="text-h6">Form Templates</span>
                    </div>
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-help-circle-outline" variant="text" size="small" v-bind="props"></v-btn>
                      </template>
                      <span>Apply pre-defined templates or save your own</span>
                    </v-tooltip>
                  </div>

                  <p class="text-body-2 mb-4">Choose a pre-defined template to quickly create common forms.</p>

                  <v-card class="mb-4">
                    <v-list>
                      <v-list-item @click="applyTemplate('contact')" prepend-icon="mdi-email-outline"
                        title="Contact Form" subtitle="Name, email, subject and message fields"></v-list-item>
                      <v-list-item @click="applyTemplate('login')" prepend-icon="mdi-login" title="Login Form"
                        subtitle="Email/username and password with validation"></v-list-item>
                      <v-list-item @click="applyTemplate('register')" prepend-icon="mdi-account-plus"
                        title="Registration Form" subtitle="Complete user registration form"></v-list-item>
                      <v-list-item @click="applyTemplate('survey')" prepend-icon="mdi-poll" title="Survey Form"
                        subtitle="Various question types for feedback"></v-list-item>
                    </v-list>
                  </v-card>

                  <v-alert type="info" variant="tonal" class="mb-4">
                    Applying a template will replace your current form fields.
                  </v-alert>

                  <v-divider class="my-4"></v-divider>

                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-content-save</v-icon>
                    <span class="text-h6">Save Current Form</span>
                  </div>

                  <v-text-field v-model="customTemplateName" label="Template Name" variant="outlined"
                    density="comfortable" prepend-inner-icon="mdi-tag" class="mb-4"></v-text-field>

                  <v-btn color="primary" prepend-icon="mdi-content-save" block @click="saveCurrentTemplate">
                    Save Current Form as Template
                  </v-btn>
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </div>

      <div class="preview-area pa-4 d-flex flex-column">
        <div class="d-flex justify-space-between align-center mb-3">
          <v-chip color="primary" variant="flat" size="small" class="mr-2">
            <v-icon start size="small">mdi-eye</v-icon>
            Live Preview
          </v-chip>
          <div>
            <v-chip v-if="previewMode === 'desktop'" color="grey" size="small">
              <v-icon start size="small">mdi-monitor</v-icon>
              Desktop View
            </v-chip>
            <v-chip v-else-if="previewMode === 'tablet'" color="grey" size="small">
              <v-icon start size="small">mdi-tablet</v-icon>
              Tablet View ({{ previewWidth }}px)
            </v-chip>
            <v-chip v-else-if="previewMode === 'mobile'" color="grey" size="small">
              <v-icon start size="small">mdi-cellphone</v-icon>
              Mobile View ({{ previewWidth }}px)
            </v-chip>
          </div>
        </div>

        <div class="preview-canvas flex-grow-1 pa-4 bg-grey-darken-4" :class="[
          'preview-' + previewMode]" :style="{ maxWidth: previewWidth + 'px' }">
          <v-form v-model="formValid" :validate-on-blur="formProperties.validateOnBlur"
            :validate-on-input="formProperties.validateOnInput" class="w-100" :color="formProperties.color"
            style="max-width: 600px" ref="form">
            <div class="text-center mb-6">
              <h2 class="text-h4 font-weight-bold mb-2">{{ formProperties.title }}</h2>
              <p v-if="formProperties.subtitle" class="text-body-1 text-medium-emphasis">{{ formProperties.subtitle }}
              </p>
            </div>

            <v-alert v-if="showSuccessMessage" type="success" class="mb-4">
              {{ formProperties.successMessage }}
            </v-alert>

            <v-btn v-if="formProperties.showGoogleLogin" :color="formProperties.googleButtonColor"
              :variant="formProperties.googleButtonVariant" :size="formProperties.googleButtonSize"
              :rounded="formProperties.googleButtonRounded" :elevation="formProperties.googleButtonElevation" block
              class="mb-4" prepend-icon="mdi-google">
              {{ formProperties.googleLoginText }}
            </v-btn>

            <v-btn v-if="formProperties.showLinkedInLogin" :color="formProperties.linkedInButtonColor"
              :variant="formProperties.linkedInButtonVariant" :size="formProperties.linkedInButtonSize"
              :rounded="formProperties.linkedInButtonRounded" :elevation="formProperties.linkedInButtonElevation" block
              class="mb-4" prepend-icon="mdi-linkedin">
              {{ formProperties.linkedInLoginText }}
            </v-btn>

            <v-divider
              v-if="(formProperties.showGoogleLogin || formProperties.showLinkedInLogin) && formProperties.showDivider"
              class="mb-4">
              {{ formProperties.dividerText }}
            </v-divider>

            <template v-for="(field, index) in formFields" :key="index">

              <v-text-field v-if="field.type === 'email'" v-model="field.value" :label="field.label"
                :placeholder="field.placeholder" :variant="formProperties.variant" :density="formProperties.density"
                :color="formProperties.color" :disabled="formProperties.disabled" :readonly="formProperties.readonly"
                :persistent-placeholder="formProperties.persistentPlaceholder" :prepend-icon="field.icon"
                base-color="primary" :rules="field.required ? [
                  v => !!v || 'This field is required',
                  v => /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) || 'Invalid email format'
                ] : []" class="mb-4"></v-text-field>

              <v-text-field v-else-if="field.type === 'text'" v-model="field.value" :label="field.label"
                :placeholder="field.placeholder" :variant="formProperties.variant" :density="formProperties.density"
                :color="formProperties.color" :disabled="formProperties.disabled" :readonly="formProperties.readonly"
                :persistent-placeholder="formProperties.persistentPlaceholder" :prepend-icon="field.icon"
                :counter="field.counter" base-color="primary"
                :rules="field.required ? [v => !!v || 'This field is required'] : []" class="mb-4"></v-text-field>

              <v-text-field v-else-if="field.type === 'password'" v-model="field.value" type="password"
                :label="field.label" :placeholder="field.placeholder" :variant="formProperties.variant"
                :density="formProperties.density" :color="formProperties.color" :disabled="formProperties.disabled"
                :readonly="formProperties.readonly" :persistent-placeholder="formProperties.persistentPlaceholder"
                :prepend-icon="field.icon" base-color="primary" :rules="field.required ? [
                  v => !!v || 'This field is required',
                  v => v.length >= 8 || 'Password must be at least 8 characters',
                  v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
                  v => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
                  v => /[0-9]/.test(v) || 'Password must contain at least one number',
                  v => /[^A-Za-z0-9]/.test(v) || 'Password must contain at least one special character'
                ] : []" class="mb-4"></v-text-field>

              <v-textarea v-else-if="field.type === 'textarea'" v-model="field.value" :label="field.label"
                :placeholder="field.placeholder" :variant="formProperties.variant" :density="formProperties.density"
                :color="formProperties.color" :disabled="formProperties.disabled" :readonly="formProperties.readonly"
                :persistent-placeholder="formProperties.persistentPlaceholder" :prepend-icon="field.icon"
                base-color="primary" :rules="field.required ? [v => !!v || 'This field is required'] : []" auto-grow
                rows="3" class="mb-4"></v-textarea>

              <v-select v-else-if="field.type === 'select'" v-model="field.value" :label="field.label"
                :items="field.options ? field.options.split(',').map(o => o.trim()) : []"
                :placeholder="field.placeholder" :variant="formProperties.variant" :density="formProperties.density"
                :color="formProperties.color" :disabled="formProperties.disabled" :readonly="formProperties.readonly"
                :persistent-placeholder="formProperties.persistentPlaceholder" :prepend-icon="field.icon"
                base-color="primary" :rules="field.required ? [v => !!v || 'This field is required'] : []"
                class="mb-4"></v-select>

              <v-radio-group v-else-if="field.type === 'radio'" v-model="field.value" :label="field.label"
                :rules="field.required ? [v => !!v || 'This field is required'] : []" :prepend-icon="field.icon"
                class="mb-4">
                <v-radio
                  v-for="(option, optionIndex) in field.options ? field.options.split(',').map(o => o.trim()) : []"
                  :key="index + '-' + optionIndex" :label="option" :value="option" :color="formProperties.color"
                  :disabled="formProperties.disabled" :readonly="formProperties.readonly"></v-radio>
              </v-radio-group>

              <v-checkbox v-else-if="field.type === 'checkbox'" v-model="field.value" :label="field.label"
                :color="formProperties.color" :disabled="formProperties.disabled" :readonly="formProperties.readonly"
                :prepend-icon="field.icon" :rules="field.required ? [v => !!v || 'This field is required'] : []"
                class="mb-4"></v-checkbox>
            </template>

            <div class="d-flex" :class="formProperties.blockButtons ? 'flex-column mt-4' : 'justify-end mt-4'">
              <v-btn :color="formProperties.cancelButtonColor" :class="formProperties.blockButtons ? 'mb-2' : 'mr-2'"
                :variant="formProperties.buttonVariant" :block="formProperties.blockButtons" @click="resetForm">
                {{ formProperties.cancelButtonText }}
              </v-btn>
              <v-btn :color="formProperties.submitButtonColor" :disabled="!formValid"
                :variant="formProperties.buttonVariant" :block="formProperties.blockButtons" @click="submitForm">
                {{ formProperties.submitButtonText }}
              </v-btn>
            </div>
          </v-form>
        </div>

        <div class="d-flex justify-end mt-3">
          <v-btn color="error" class="mr-2" prepend-icon="mdi-refresh" variant="tonal" @click="resetAllFields">
            Reset All Fields
          </v-btn>
          <v-btn color="secondary" class="mr-2" prepend-icon="mdi-eye" @click="previewCode">
            Preview Code
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-content-copy" @click="copyFormCode">
            Copy Code
          </v-btn>
        </div>
      </div>
    </v-main>

    <v-dialog v-model="showCodeDialog" width="800">
      <v-card class="bg-grey-darken-4">
        <v-card-title class="d-flex justify-space-between align-center pa-4">
          <v-tabs v-model="codeTab" color="primary">
            <v-tab value="template">Template</v-tab>
            <v-tab value="theme">Theme</v-tab>
          </v-tabs>
          <v-btn icon="mdi-close" variant="text" @click="showCodeDialog = false"></v-btn>
        </v-card-title>
        <v-card-text>
          <v-window v-model="codeTab">
            <v-window-item value="template">
              <pre class="code-block"><code class="language-vue" ref="codeElement">{{ highlightedTemplateCode }}</code>
          </pre>
            </v-window-item>
            <v-window-item value="script">
              <pre class="code-block"><code class="language-javascript" ref="scriptCodeElement">{{ highlightedScriptCode
              }}</code>
          </pre>
            </v-window-item>
            <v-window-item value="theme">
              <pre class="code-block"><code class="language-css" ref="themeCodeElement">{{ highlightedThemeCode }}</code>
          </pre>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn color="secondary" prepend-icon="mdi-content-copy" @click="copyCurrentTab">
            Copy Current Tab
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Snackbar v-model="showSnackbarMessage" :text="snackbarText" :color="snackbarColor" />
  </v-app>
</template>

<script setup lang="ts">
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/atom-one-dark.css';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import type { VForm } from 'vuetify/components';
import Snackbar from '../../components/snackbar.vue';
import { useUserStore } from '../../stores/userStore';
import { getFormTemplate } from '../../utils/formTemplates';
import icons from '../../utils/icons';
import theme from '../../utils/theme';
import type { FormField, FormProperties, FormVariant, FormDensity, MessageLocation, ButtonVariant } from '../../utils/studio/form-types';

const emit = defineEmits(['update:content', 'save']);


const tab = ref('content');
const codeElement = ref<HTMLElement | null>(null);
const scriptCodeElement = ref<HTMLElement | null>(null);
const themeCodeElement = ref<HTMLElement | null>(null);
const previewMode = ref('desktop');
const showCodeDialog = ref(false);
const generatedCode = ref('');
const snackbarColor = ref('success');
const formValid = ref(false);
const showSuccessMessage = ref(false);
const showSnackbarMessage = ref(false);
const snackbarText = ref('Code copied to clipboard');
const form = ref<InstanceType<typeof VForm> | null>(null);
const codeTab = ref('template');
const customTemplateName = ref('');
const customTemplates = ref<{ name: string, fields: FormField[] }[]>([]);

const fieldTypes = [
  'text',
  'password',
  'textarea',
  'select',
  'radio',
  'checkbox',
  'email'
];

const fieldVariants: FormVariant[] = ['outlined', 'filled', 'plain', 'underlined', 'solo'];
const densityOptions: FormDensity[] = ['default', 'comfortable', 'compact'];
const messageLocations: MessageLocation[] = ['bottom', 'top'];
const buttonVariants: ButtonVariant[] = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'];

const colors = [
  { text: 'Default', value: 'default' },
  { text: 'Primary', value: 'primary' },
  { text: 'Secondary', value: 'secondary' },
  { text: 'Success', value: 'success' },
  { text: 'Info', value: 'info' },
  { text: 'Warning', value: 'warning' },
  { text: 'Error', value: 'error' }
] as const;

const formFields = ref<FormField[]>([
  {
    type: 'text',
    label: 'Email',
    placeholder: 'Enter your email',
    value: '',
    required: true
  },
  {
    type: 'select',
    label: 'Subject',
    placeholder: 'Select a subject',
    value: '',
    options: 'Information, Support, Other',
    required: true
  },
  {
    type: 'textarea',
    label: 'Message',
    placeholder: 'Enter your message',
    value: '',
    required: true
  }
]);

const formProperties = ref<FormProperties>({
  variant: 'outlined',
  density: 'default',
  color: 'primary',
  disabled: false,
  readonly: false,
  persistentPlaceholder: false,
  validateOnBlur: true,
  validateOnInput: false,
  successMessage: 'Form submitted successfully!',
  errorMessage: 'Please correct the errors in the form.',
  messageLocation: 'bottom',
  submitButtonText: 'Submit',
  cancelButtonText: 'Reset',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  buttonVariant: 'tonal',
  blockButtons: false,
  title: 'Form Title',
  subtitle: 'Optional subtitle',
  showGoogleLogin: false,
  googleLoginText: 'Sign in with Google',
  showLinkedInLogin: false,
  linkedInLoginText: 'Sign in with LinkedIn',
  showDivider: true,
  dividerText: 'or continue with email',
  googleButtonVariant: 'outlined',
  googleButtonColor: 'default',
  googleButtonSize: 'large',
  googleButtonRounded: true,
  googleButtonElevation: 0,
  linkedInButtonVariant: 'outlined',
  linkedInButtonColor: 'default',
  linkedInButtonSize: 'large',
  linkedInButtonRounded: true,
  linkedInButtonElevation: 0
});

const addField = () => {
  formFields.value.push({
    type: 'text',
    label: 'New Field',
    placeholder: 'Enter a value',
    value: '',
    required: false,
    counter: false
  });
};

const removeField = (index: number) => {
  formFields.value.splice(index, 1);
};

const submitForm = async () => {
  if (form.value) {
    const { valid } = await form.value.validate();
    if (valid) {
      showSuccessMessage.value = true;
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 3000);
    }
  }
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
  }
  showSuccessMessage.value = false;
  formFields.value.forEach(field => {
    field.value = '';
  });
};

const applyTemplate = (templateType: string) => {
  const templateFields = getFormTemplate(templateType);

  if (templateFields && templateFields.length > 0) {
    formFields.value = templateFields;

    switch (templateType) {
      case 'login':
        formProperties.value.title = 'Welcome Back';
        formProperties.value.subtitle = 'Sign in to your account';
        formProperties.value.showGoogleLogin = true;
        formProperties.value.showDivider = true;
        break;
      case 'register':
        formProperties.value.title = 'Create Account';
        formProperties.value.subtitle = 'Join our community today';
        formProperties.value.showGoogleLogin = true;
        formProperties.value.showDivider = true;
        break;
      case 'contact':
        formProperties.value.title = 'Contact Us';
        formProperties.value.subtitle = 'We\'d love to hear from you';
        formProperties.value.showGoogleLogin = false;
        formProperties.value.showDivider = false;
        break;
      case 'survey':
        formProperties.value.title = 'Customer Survey';
        formProperties.value.subtitle = 'Help us improve our service';
        formProperties.value.showGoogleLogin = false;
        formProperties.value.showDivider = false;
        break;
    }

    snackbarText.value = `${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template applied successfully!`;
    showSnackbarMessage.value = true;
  }
};

const generateFormCode = () => {
  const templateCode = generateTemplateCode();
  const scriptCode = generateScriptCode();
  const themeCode = theme;

  switch (codeTab.value) {
    case 'template':
      return templateCode;
    case 'script':
      return scriptCode;
    case 'theme':
      return themeCode;
    default:
      return `${templateCode}\n\n${scriptCode}\n\n${themeCode}`;
  }
};

const generateTemplateCode = () => {
  let code = '<v-form\n';
  code += '  v-model="formValid"\n';
  code += '  ref="formRef"\n';
  if (formProperties.value.validateOnBlur) code += '  validate-on-blur\n';
  if (formProperties.value.validateOnInput) code += '  validate-on-input\n';
  code += '>\n';

  code += '  <div class="text-center mb-6">\n';
  code += `    <h2 class="text-h4 font-weight-bold mb-2">${formProperties.value.title}</h2>\n`;
  if (formProperties.value.subtitle) {
    code += `    <p class="text-body-1 text-medium-emphasis">${formProperties.value.subtitle}</p>\n`;
  }
  code += '  </div>\n\n';

  code += '  <v-alert v-if="showSuccessMessage" type="success" class="mb-4">\n';
  code += `    ${formProperties.value.successMessage}\n`;
  code += '  </v-alert>\n\n';

  if (formProperties.value.showGoogleLogin) {
    code += '  <v-btn\n';
    code += `    color="${formProperties.value.googleButtonColor}"\n`;
    code += `    variant="${formProperties.value.googleButtonVariant}"\n`;
    code += `    size="${formProperties.value.googleButtonSize}"\n`;
    if (formProperties.value.googleButtonRounded) code += '    rounded\n';
    code += `    elevation="${formProperties.value.googleButtonElevation}"\n`;
    code += '    block\n';
    code += '    class="mb-4"\n';
    code += '    prepend-icon="mdi-google"\n';
    code += '  >\n';
    code += `    ${formProperties.value.googleLoginText}\n`;
    code += '  </v-btn>\n\n';
  }

  if (formProperties.value.showLinkedInLogin) {
    code += '  <v-btn\n';
    code += `    color="${formProperties.value.linkedInButtonColor}"\n`;
    code += `    variant="${formProperties.value.linkedInButtonVariant}"\n`;
    code += `    size="${formProperties.value.linkedInButtonSize}"\n`;
    if (formProperties.value.linkedInButtonRounded) code += '    rounded\n';
    code += `    elevation="${formProperties.value.linkedInButtonElevation}"\n`;
    code += '    block\n';
    code += '    class="mb-4"\n';
    code += '    prepend-icon="mdi-linkedin"\n';
    code += '  >\n';
    code += `    ${formProperties.value.linkedInLoginText}\n`;
    code += '  </v-btn>\n\n';
  }

  if ((formProperties.value.showGoogleLogin || formProperties.value.showLinkedInLogin) && formProperties.value.showDivider) {
    code += '  <v-divider class="mb-4">\n';
    code += `    ${formProperties.value.dividerText}\n`;
    code += '  </v-divider>\n\n';
  }

  formFields.value.forEach(field => {
    switch (field.type) {
      case 'text':
      case 'email':
        code += `  <v-text-field\n`;
        break;
      case 'password':
        code += `  <v-text-field\n    type="password"\n`;
        break;
      case 'textarea':
        code += `  <v-textarea\n`;
        break;
      case 'select':
        code += `  <v-select\n`;
        break;
      case 'radio':
        code += `  <v-radio-group\n`;
        break;
      case 'checkbox':
        code += `  <v-checkbox\n`;
        break;
    }

    code += `    v-model="form.${field.label.toLowerCase().replace(/\s+/g, '_')}"\n`;
    code += `    label="${field.label}"\n`;
    if (field.placeholder) code += `    placeholder="${field.placeholder}"\n`;
    if (field.icon) code += `    prepend-icon="${field.icon}"\n`;
    if (field.counter) code += `    counter\n`;
    if (formProperties.value.variant !== 'outlined') code += `    variant="${formProperties.value.variant}"\n`;
    if (formProperties.value.density !== 'default') code += `    density="${formProperties.value.density}"\n`;
    if (formProperties.value.color !== 'primary') code += `    color="${formProperties.value.color}"\n`;
    if (formProperties.value.disabled) code += `    disabled\n`;
    if (formProperties.value.readonly) code += `    readonly\n`;
    if (formProperties.value.persistentPlaceholder) code += `    persistent-placeholder\n`;

    if (field.required) {
      code += `    :rules="[`;

      code += `v => !!v || 'This field is required'`;

      if (field.type === 'email') {
        code += `,
      v => /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) || 'Invalid email format'`;
      } else if (field.type === 'password') {
        code += `,
      v => v.length >= 8 || 'Password must be at least 8 characters',
      v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
      v => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
      v => /[0-9]/.test(v) || 'Password must contain at least one number',
      v => /[^A-Za-z0-9]/.test(v) || 'Password must contain at least one special character'`;
      }

      code += `]"\n`;
    }

    if (field.type === 'select' || field.type === 'radio') {
      code += `    :items="[${field.options?.split(',').map(o => `'${o.trim()}'`).join(', ')}]"\n`;
    }

    if (field.type === 'textarea') {
      code += `    auto-grow\n`;
      code += `    rows="3"\n`;
    }

    code += `    class="mb-4"\n`;
    code += `  ></${field.type === 'text' || field.type === 'email' || field.type === 'password' ? 'v-text-field' :
      field.type === 'textarea' ? 'v-textarea' :
        field.type === 'select' ? 'v-select' :
          field.type === 'radio' ? 'v-radio-group' : 'v-checkbox'}>\n`;
  });

  code += '\n  <div class="d-flex';
  if (formProperties.value.blockButtons) {
    code += ' flex-column';
  } else {
    code += ' justify-end';
  }
  code += ' mt-4">\n';

  code += `    <v-btn color="${formProperties.value.cancelButtonColor}"`;
  if (formProperties.value.blockButtons) {
    code += ' class="mb-2"';
  } else {
    code += ' class="mr-2"';
  }
  code += ` variant="${formProperties.value.buttonVariant}"`;
  if (formProperties.value.blockButtons) code += ' block';
  code += ` @click="resetForm">${formProperties.value.cancelButtonText}</v-btn>\n`;

  code += `    <v-btn color="${formProperties.value.submitButtonColor}" :disabled="!formValid"`;
  code += ` variant="${formProperties.value.buttonVariant}"`;
  if (formProperties.value.blockButtons) code += ' block';
  code += ` @click="submitForm">${formProperties.value.submitButtonText}</v-btn>\n`;

  code += '  </div>\n';
  code += '</v-form>';

  return code;
};

const generateScriptCode = () => {
  let code = `
import { ref } from 'vue';

const form = ref({`;

  // Générer les propriétés du modèle de formulaire basées sur les champs actuels
  formFields.value.forEach((field, index) => {
    const fieldName = field.label.toLowerCase().replace(/\s+/g, '_');
    code += `
  ${fieldName}: ${field.type === 'checkbox' ? 'false' : '""'}`;
    if (index < formFields.value.length - 1) {
      code += ',';
    }
  });

  code += `
});

const formValid = ref(false);
const showSuccessMessage = ref(false);
const formRef = ref(null);

const submitForm = () => {
  console.log('Form submitted:', form.value);
  showSuccessMessage.value = true;
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
};

const resetForm = () => {
  if (formRef.value) {
    formRef.value.reset();
  }
  showSuccessMessage.value = false;
};`;

  return code;
};

const previewCode = () => {
  generatedCode.value = generateFormCode();
  showCodeDialog.value = true;
};

const copyFormCode = () => {
  const templateCode = generateTemplateCode();
  const scriptCode = generateScriptCode();
  const fullCode = `${templateCode}\n\n${scriptCode}`;

  navigator.clipboard.writeText(fullCode)
    .then(() => {
      snackbarText.value = 'Code copied to clipboard!';
      showSnackbarMessage.value = true;
    })
    .catch(err => {
      console.error('Error copying:', err);
    });
};

const copyCurrentTab = () => {
  let code;
  switch (codeTab.value) {
    case 'template':
      code = generateTemplateCode();
      break;
    case 'script':
      code = generateScriptCode();
      break;
    case 'theme':
      code = theme;
      break;
    default:
      code = '';
  }
  window.navigator.clipboard.writeText(code)
    .catch(err => {
      console.error('Error copying:', err);
    });
};

const generateFormCodeSilently = () => {
  const code = generateFormCode();
  emit('update:content', code);
};

const previewWidth = computed(() => {
  switch (previewMode.value) {
    case 'mobile': return 320;
    case 'tablet': return 600;
    default: return 900;
  }
});

const resetAllFields = () => {
  if (confirm('Are you sure you want to reset all form fields? This action cannot be undone.')) {
    formFields.value = [];
    snackbarText.value = 'All form fields have been reset';
    showSnackbarMessage.value = true;
  }
};

const saveCurrentTemplate = async () => {
  if (!customTemplateName.value) {
    snackbarText.value = 'Please enter a template name';
    showSnackbarMessage.value = true;
    return;
  }

  const templateData = {
    ...JSON.parse(JSON.stringify(formProperties.value)),
    fields: [...formFields.value]
  };

  const response = await userStore.saveTemplate(customTemplateName.value, templateData, 'form');

  if (response) {
    snackbarText.value = `Template "${customTemplateName.value}" saved successfully`;
    showSnackbarMessage.value = true;
    customTemplateName.value = '';
    await userStore.loadData();
  } else {
    snackbarText.value = `Failed to save template "${customTemplateName.value}"`;
    showSnackbarMessage.value = true;
  }
};

const userStore = useUserStore();

// Fonction pour charger les données du template depuis le store en fonction de l'ID dans l'URL
const loadTemplateFromStore = () => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('templateId');

  if (!templateId) return;

  console.log('Loading template with ID:', templateId);

  const template = userStore.studioComponents.find(t => t.id === parseInt(templateId) && t.component_type === 'form');

  if (template && template.content) {
    console.log('Template found in store:', template.name);

    if (template.content.trim().startsWith('<v-form')) {
      console.log('HTML content detected, applying directly');
      emit('update:content', template.content);
      return;
    }

    try {
      const templateData = JSON.parse(template.content);
      console.log('Template data loaded:', templateData);

      Object.assign(formProperties.value, templateData);

      if (templateData.fields) {
        formFields.value = [...templateData.fields];
      }

      generateFormCodeSilently();

      snackbarText.value = 'Template loaded successfully';
      showSnackbarMessage.value = true;
    } catch (error) {
      console.error('Error parsing template:', error);
      emit('update:content', template.content);
    }
  }
};

watch(() => {
  if (typeof window !== 'undefined') {
    return window.location.search;
  }
  return '';
}, () => {
  if (typeof window !== 'undefined') {
    loadTemplateFromStore();
  }
}, { immediate: true });

const highlightedTemplateCode = computed(() => {
  return generateTemplateCode();
});

const highlightedScriptCode = computed(() => {
  return generateScriptCode();
});

const highlightedThemeCode = computed(() => {
  return theme;
});

watch(codeTab, () => {
  nextTick(() => {
    if (codeTab.value === 'template' && codeElement.value) {
      hljs.highlightElement(codeElement.value);
    } else if (codeTab.value === 'script' && scriptCodeElement.value) {
      hljs.highlightElement(scriptCodeElement.value);
    } else if (codeTab.value === 'theme' && themeCodeElement.value) {
      hljs.highlightElement(themeCodeElement.value);
    }
  });
});

onMounted(() => {
  generateFormCodeSilently();
});

watch([formFields, formProperties], () => {
  generateFormCodeSilently();
}, { deep: true });

watch(previewMode, () => {
  generateFormCodeSilently();
});
</script>

<style scoped>
.fill-height {
  height: 100%;
}

.control-panel {
  width: 350px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.preview-area {
  flex: 1;
  background-color: #f5f5f5;
  overflow: auto;
}

.preview-canvas {
  border-radius: 8px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 32px;
  overflow: auto;
  height: auto;
  min-height: 400px;
  max-height: 70vh;
}

.preview-desktop {
  padding: 32px;
}

.code-block {
  margin: 0;
  padding: 0;
  border-radius: 8px;
  background-color: #282c34;
  overflow: auto;
  max-height: 60vh;
}

.code-block code {
  display: block;
  padding: 1rem;
  font-family: "Fira Code", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
