<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card class="mb-8 rounded-lg" elevation="3">
          <v-card-title class="text-h6 pa-4 bg-secondary text-white">
            <v-icon size="large" class="mr-2">mdi-contrast-circle</v-icon>
            Contrast Checker
          </v-card-title>
          <v-card-text class="pa-4">

            <v-row>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-color-picker v-model="textColorPicker" mode="hexa" hide-canvas elevation="4"
                      @update:model-value="updateTextColor" class="mb-4"></v-color-picker>
                    <v-text-field v-model="textColor" label="Text color" variant="outlined" density="comfortable"
                      prepend-inner-icon="mdi-format-color-text" hint="Supports hex, rgb, hsl or color names"
                      persistent-hint @update:model-value="textColorFromField"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-color-picker v-model="backgroundColorPicker" mode="hexa" hide-canvas elevation="4"
                      @update:model-value="updateBackgroundColor" class="mb-4"></v-color-picker>
                    <v-text-field v-model="backgroundColor" label="Background color" variant="outlined"
                      density="comfortable" prepend-inner-icon="mdi-format-color-fill"
                      hint="Supports hex, rgb, hsl or color names" persistent-hint
                      @update:model-value="backgroundColorFromField"></v-text-field>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-center">
                    <v-btn @click="getContrast" color="primary" prepend-icon="mdi-calculator" class="mb-4">
                      Calculate contrast
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="6">
                <v-card :style="`background-color: ${backgroundColor}`" class="pa-4 rounded-lg h-100" elevation="1">
                  <v-card-title :style="`color: ${textColor}`" class="text-center">
                    Contrast Preview
                  </v-card-title>
                  <v-card-text :style="`color: ${textColor}`" class="text-center">
                    <div class="mb-4">
                      <p class="text-body-1 mb-2">Normal Text (16px)</p>
                      <p class="text-body-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    <div class="mb-4">
                      <p class="text-body-1 mb-2">Large Text (18px+)</p>
                      <p class="text-h6">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div class="mb-4">
                      <p class="text-body-1 mb-2">Bold Text</p>
                      <p class="text-body-1 font-weight-bold">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div class="mb-4">
                      <p class="text-body-1 mb-2">Italic Text</p>
                      <p class="text-body-1 font-italic">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div>
                      <p class="text-body-1 mb-2">Link Example</p>
                      <a :style="`color: ${textColor}`" href="/accessibility" class="text-decoration-underline">Lorem
                        ipsum
                        dolor</a>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-divider class="my-4" v-if="contrast > 0"></v-divider>

            <v-row v-if="contrast > 0">
              <v-col cols="12" md="6" class="mx-auto">
                <v-card class="pa-4 rounded-lg" elevation="3">
                  <v-card-title class="text-center">
                    <div class="text-h4 font-weight-bold mb-2">Contrast Ratio: {{ Math.round(contrast * 100) / 100 }}:1
                    </div>
                    <v-chip :color="contrast < 4.5 ? 'error' : contrast < 7 ? 'warning' : 'success'" class="mb-2">
                      {{ contrast < 4.5 ? 'Insufficient Contrast' : contrast < 7 ? 'Acceptable Contrast'
                        : 'Excellent Contrast' }} </v-chip>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="6">
                        <v-card variant="outlined" :color="contrast < 4.5 ? 'error' : 'success'" class="pa-2">
                          <div class="d-flex align-center justify-center">
                            <v-icon :color="contrast < 4.5 ? 'error' : 'success'" class="mr-2">
                              {{ contrast < 4.5 ? 'mdi-close-circle' : 'mdi-check-circle' }} </v-icon>
                                <span>Normal Text (min. 4.5:1)</span>
                          </div>
                        </v-card>
                      </v-col>
                      <v-col cols="6">
                        <v-card variant="outlined" :color="contrast < 3 ? 'error' : 'success'" class="pa-2">
                          <div class="d-flex align-center justify-center">
                            <v-icon :color="contrast < 3 ? 'error' : 'success'" class="mr-2">
                              {{ contrast < 3 ? 'mdi-close-circle' : 'mdi-check-circle' }} </v-icon>
                                <span>Large Text (min. 3:1)</span>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                    <div class="mt-4 text-center">
                      <p class="text-body-1">
                        {{ contrast < 4.5
                          ? 'The contrast is insufficient for good readability. Try more contrasting colors.'
                          : 'Congratulations! Your colors meet contrast standards for an accessible site.' }} </p>
                    </div>
                    <div class="mt-4">
                      <v-list density="compact">
                        <v-list-item prepend-icon="mdi-information">
                          <v-list-item-title>WCAG 2.1 AA Standard</v-list-item-title>
                          <v-list-item-subtitle>
                            <span>Normal Text (min. 4.5:1): </span>
                            <v-icon size="small" color="success" v-if="contrast >= 4.5">mdi-check</v-icon>
                            <v-icon size="small" color="error" v-else>mdi-close</v-icon>
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item prepend-icon="mdi-information">
                          <v-list-item-title>WCAG 2.1 AAA Standard</v-list-item-title>
                          <v-list-item-subtitle>
                            <span>Normal Text (min. 7:1): </span>
                            <v-icon size="small" color="success" v-if="contrast >= 7">mdi-check</v-icon>
                            <v-icon size="small" color="error" v-else>mdi-close</v-icon>
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-8 rounded-lg" elevation="3">
          <v-card-title class="text-h6 pa-4 bg-indigo text-white">
            <v-icon size="large" class="mr-2">mdi-file-tree</v-icon>
            Semantic Structure Analyzer
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4 mb-4">
                  <v-card-title class="text-h6 mb-2">
                    <v-icon start>mdi-web</v-icon>
                    Analyze URL
                  </v-card-title>
                  <v-card-text>
                    <v-text-field v-model="semanticUrl" label="Enter URL to analyze semantic structure"
                      variant="outlined" density="comfortable" placeholder="https://example.com"
                      @keyup.enter="analyzeSemanticStructure"></v-text-field>
                    <premium-feature v-if="!isPremium" title="Semantic structure analysis" icon="mdi-web"
                      color="primary" feature-key="accessibility" />
                    <v-btn v-if="isPremium" color="primary" prepend-icon="mdi-magnify" @click="analyzeSemanticStructure"
                      :loading="semanticLoading" :disabled="!semanticUrl" block class="mt-4">
                      Analyze Structure
                    </v-btn>
                  </v-card-text>
                </v-card>

                <v-card v-if="semanticResults" variant="outlined" class="pa-4">
                  <v-card-title class="d-flex align-center">
                    <span>Structure Score</span>
                    <v-spacer></v-spacer>
                    <v-progress-circular :model-value="semanticResults.score.toString()"
                      :color="getScoreColor(semanticResults.score)" size="60" width="8">
                      <span class="text-subtitle-2 font-weight-bold">{{ semanticResults.score }}%</span>
                    </v-progress-circular>
                  </v-card-title>

                  <v-card-text>
                    <v-list density="compact">
                      <v-list-subheader>Semantic Elements</v-list-subheader>
                      <v-list-item v-for="(value, key) in semanticResults.structure" :key="key"
                        :prepend-icon="value ? 'mdi-check-circle' : 'mdi-close-circle'" :title="getElementTitle(key)"
                        :subtitle="value ? 'Present' : 'Missing'">
                      </v-list-item>
                    </v-list>

                    <v-divider class="my-4"></v-divider>

                    <v-list v-if="semanticResults.readabilityAnalysis" density="compact">
                      <v-list-subheader>Readability Analysis</v-list-subheader>
                      <v-list-item prepend-icon="mdi-book-open-variant"
                        :title="`Score: ${Math.round(semanticResults.readabilityAnalysis.score)}`"
                        :subtitle="semanticResults.readabilityAnalysis.grade">
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-text"
                        :title="`Word Count: ${semanticResults.readabilityAnalysis.wordCount}`">
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-format-align-left"
                        :title="`Average Sentence Length: ${semanticResults.readabilityAnalysis.averageSentenceLength.toFixed(1)} words`">
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-format-letter-case"
                        :title="`Complex Words: ${semanticResults.readabilityAnalysis.complexWordCount}`"
                        :subtitle="`${Math.round(semanticResults.readabilityAnalysis.complexWordCount / semanticResults.readabilityAnalysis.wordCount * 100)}% of total words`">
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card v-if="semanticResults && semanticResults.issues.length > 0" variant="outlined"
                  class="pa-4 mb-4">
                  <v-card-title class="text-h6 mb-2">
                    <v-icon start>mdi-alert-circle</v-icon>
                    Issues Found ({{ semanticResults.issues.length }})
                  </v-card-title>
                  <v-card-text>
                    <v-expansion-panels>
                      <v-expansion-panel v-for="(issue, index) in semanticResults.issues" :key="index">
                        <v-expansion-panel-title>
                          <div class="d-flex align-center">
                            <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
                            <div>{{ issue.element }}</div>
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <div class="pa-2">
                            <div class="font-weight-medium mb-2">{{ issue.issue }}</div>
                            <v-alert type="info" variant="tonal" class="mb-0">
                              {{ issue.suggestion }}
                            </v-alert>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card-text>
                </v-card>

                <v-card v-if="semanticResults && semanticResults.headingStructure.length > 0" variant="outlined"
                  class="pa-4">
                  <v-card-title class="text-h6 mb-2">
                    <v-icon start>mdi-format-header-pound</v-icon>
                    Heading Structure
                  </v-card-title>
                  <v-card-text>
                    <div style="max-height: 400px; overflow-y: auto;">
                      <div v-for="(heading, index) in semanticResults.headingStructure" :key="index"
                        class="py-2 px-3 mb-2 rounded-lg"
                        :style="`margin-left: ${(heading.level - 1) * 20}px; background-color: var(--v-theme-${getHeadingColor(heading.level)})`">
                        <div class="d-flex align-center">
                          <v-chip size="small" color="primary" class="mr-2">H{{ heading.level }}</v-chip>
                          <div class="text-truncate">{{ heading.text || '(empty heading)' }}</div>
                        </div>
                      </div>
                    </div>

                    <v-alert v-if="!semanticResults.structure.validHeadingStructure" type="warning" class="mt-4">
                      The heading structure is not properly ordered. Headings should follow a hierarchical structure
                      without
                      skipping levels.
                    </v-alert>
                  </v-card-text>
                </v-card>

                <v-card v-if="semanticResults && semanticResults.readabilityAnalysis" variant="outlined"
                  class="pa-4 mt-4">
                  <v-card-title class="text-h6 mb-2">
                    <v-icon start>mdi-text-box</v-icon>
                    Readability Suggestions
                  </v-card-title>
                  <v-card-text>
                    <v-alert :color="getReadabilityColor(semanticResults.readabilityAnalysis.score)" variant="tonal"
                      class="mb-4">
                      {{ semanticResults.readabilityAnalysis.suggestion }}
                    </v-alert>

                    <v-list density="compact">
                      <v-list-item prepend-icon="mdi-checkbox-marked-circle"
                        v-if="semanticResults.readabilityAnalysis.score > 60">
                        <v-list-item-title>Good readability score</v-list-item-title>
                        <v-list-item-subtitle>Your content is easy to read for most audiences</v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item prepend-icon="mdi-format-line-spacing"
                        v-if="semanticResults.readabilityAnalysis.averageSentenceLength > 20">
                        <v-list-item-title>Consider shorter sentences</v-list-item-title>
                        <v-list-item-subtitle>Aim for an average of 15-20 words per sentence</v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item prepend-icon="mdi-format-letter-case"
                        v-if="semanticResults.readabilityAnalysis.complexWordCount / semanticResults.readabilityAnalysis.wordCount > 0.2">
                        <v-list-item-title>Reduce complex words</v-list-item-title>
                        <v-list-item-subtitle>Try to use simpler terms where possible</v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item prepend-icon="mdi-text-box-multiple"
                        v-if="semanticResults.readabilityAnalysis.paragraphCount < 3 && semanticResults.readabilityAnalysis.wordCount > 200">
                        <v-list-item-title>Add more paragraphs</v-list-item-title>
                        <v-list-item-subtitle>Break up long text into smaller, manageable chunks</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-8 rounded-lg" elevation="3">
          <v-card-title class="text-h6 pa-4 bg-purple text-white">
            <v-icon size="large" class="mr-2">mdi-tag-multiple</v-icon>
            Meta Tags Analyzer
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4 mb-4">
                  <v-card-title class="text-h6 mb-2">
                    <v-icon start>mdi-web</v-icon>
                    Analyze URL
                  </v-card-title>
                  <v-card-text>
                    <v-text-field v-model="metaUrl" label="Enter URL to analyze meta tags" variant="outlined"
                      density="comfortable" placeholder="https://example.com"
                      @keyup.enter="analyzeMetaTags"></v-text-field>
                    <premium-feature v-if="!isPremium" title="Meta tags analysis" icon="mdi-web" color="primary"
                      feature-key="accessibility" />
                    <v-btn v-if="isPremium" color="primary" prepend-icon="mdi-magnify" @click="analyzeMetaTags"
                      :loading="metaLoading" :disabled="!metaUrl" block class="mt-4">
                      Analyze Meta Tags
                    </v-btn>
                  </v-card-text>
                </v-card>

                <v-card v-if="metaResults" variant="outlined" class="pa-4">
                  <v-card-title class="d-flex align-center">
                    <span>Meta Tags Score</span>
                    <v-spacer></v-spacer>
                    <v-progress-circular :model-value="metaResults.score.toString()"
                      :color="getScoreColor(metaResults.score)" size="60" width="8">
                      <span class="text-subtitle-2 font-weight-bold">{{ metaResults.score }}%</span>
                    </v-progress-circular>
                  </v-card-title>

                  <v-card-text>
                    <v-list density="compact">
                      <v-list-subheader>Essential Meta Tags</v-list-subheader>
                      <v-list-item v-for="(meta, index) in metaResults.essential" :key="'essential-' + index"
                        :prepend-icon="meta.present ? 'mdi-check-circle' : 'mdi-close-circle'" :title="meta.name"
                        :subtitle="meta.present ? 'Present' : 'Missing'">
                        <template v-slot:append v-if="meta.present && meta.content">
                          <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                              <v-icon v-bind="props" size="small" color="info">mdi-information</v-icon>
                            </template>
                            <span>{{ meta.content }}</span>
                          </v-tooltip>
                        </template>
                      </v-list-item>
                    </v-list>

                    <v-divider class="my-4"></v-divider>

                    <v-list density="compact">
                      <v-list-subheader>Social Media Tags</v-list-subheader>
                      <v-list-item v-for="(meta, index) in metaResults.social" :key="'social-' + index"
                        :prepend-icon="meta.present ? 'mdi-check-circle' : 'mdi-close-circle'" :title="meta.name"
                        :subtitle="meta.present ? 'Present' : 'Missing'">
                        <template v-slot:append v-if="meta.present && meta.content">
                          <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                              <v-icon v-bind="props" size="small" color="info">mdi-information</v-icon>
                            </template>
                            <span>{{ meta.content }}</span>
                          </v-tooltip>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card v-if="metaResults && metaResults.issues.length > 0" variant="outlined" class="pa-4 mb-4">
                  <v-card-title class="text-h6 mb-2">
                    <v-icon start>mdi-alert-circle</v-icon>
                    Issues Found ({{ metaResults.issues.length }})
                  </v-card-title>
                  <v-card-text>
                    <v-expansion-panels>
                      <v-expansion-panel v-for="(issue, index) in metaResults.issues" :key="index">
                        <v-expansion-panel-title>
                          <div class="d-flex align-center">
                            <v-icon :color="issue.severity" class="mr-2">mdi-alert</v-icon>
                            <div>{{ issue.tagName }}</div>
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <div class="pa-2">
                            <div class="font-weight-medium mb-2">{{ issue.issue }}</div>
                            <v-alert type="info" variant="tonal" class="mb-2">
                              {{ issue.recommendation }}
                            </v-alert>
                            <div v-if="issue.example" class="mt-2 pa-3 bg-grey-lighten-4 rounded-lg">
                              <code>{{ issue.example }}</code>
                            </div>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card-text>
                </v-card>

                <v-card v-if="metaResults" variant="outlined" class="pa-4">
                  <v-card-title class="text-h6 mb-2">
                    <v-icon start>mdi-code-tags</v-icon>
                    All Meta Tags
                  </v-card-title>
                  <v-card-text>
                    <v-alert type="info" variant="tonal" class="mb-4">
                      All meta tags found on the page are listed below.
                    </v-alert>
                    <div style="max-height: 400px; overflow-y: auto;" class="pa-2 bg-grey-lighten-4 rounded-lg">
                      <pre><code>{{ metaResults.metaHtml }}</code></pre>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-8 rounded-lg" elevation="3">
          <v-card-title class="text-h6 pa-4 bg-teal text-white">
            <v-icon size="large" class="mr-2">mdi-sitemap</v-icon>
            HTML Structure Visualizer
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="5">
                <v-card variant="outlined" class="pa-4 mb-4">
                  <v-card-title class="text-h6 mb-2">
                    <v-icon start>mdi-web</v-icon>
                    Analyze URL
                  </v-card-title>
                  <v-card-text>
                    <v-text-field v-model="structureUrl" label="Enter URL to visualize HTML structure"
                      variant="outlined" density="comfortable" placeholder="https://example.com"
                      @keyup.enter="analyzeHtmlStructure"></v-text-field>
                    <premium-feature v-if="!isPremium" title="HTML structure analysis" icon="mdi-web" color="primary"
                      feature-key="accessibility" />
                    <v-btn v-if="isPremium" color="primary" prepend-icon="mdi-magnify" @click="analyzeHtmlStructure"
                      :loading="structureLoading" :disabled="!structureUrl" block class="mt-4">
                      Visualize Structure
                    </v-btn>
                  </v-card-text>
                </v-card>

                <v-card v-if="structureResults" variant="outlined" class="pa-4">
                  <v-card-title class="text-h6 mb-2">
                    <v-icon start>mdi-chart-pie</v-icon>
                    Elements Distribution
                  </v-card-title>
                  <v-card-text>
                    <div class="d-flex justify-space-between mb-4">
                      <div class="text-center">
                        <div class="text-h4 font-weight-bold">{{ structureResults.totalElements }}</div>
                        <div class="text-caption">Total Elements</div>
                      </div>
                      <div class="text-center">
                        <div class="text-h4 font-weight-bold">{{ structureResults.semanticElements }}</div>
                        <div class="text-caption">Semantic Elements</div>
                      </div>
                      <div class="text-center">
                        <div class="text-h4 font-weight-bold">{{ structureResults.divCount }}</div>
                        <div class="text-caption">Div Elements</div>
                      </div>
                    </div>

                    <v-alert :color="structureResults.semanticRatio >= 0.3 ? 'success' : 'warning'" variant="tonal"
                      class="mb-4">
                      {{ structureResults.semanticRatio >= 0.3
                        ? 'Good semantic elements ratio!'
                        : 'Low semantic elements ratio. Consider using more semantic HTML elements.' }}
                    </v-alert>

                    <v-list density="compact">
                      <v-list-item v-for="(count, tag) in structureResults.topElements" :key="tag" :title="`<${tag}>`"
                        :subtitle="`${count} elements (${Math.round(count / structureResults.totalElements * 100)}%)`">
                        <template v-slot:prepend>
                          <v-avatar :color="getElementColor(tag)" size="32">
                            <span class="text-white text-caption">{{ tag }}</span>
                          </v-avatar>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="7">
                <v-card v-if="structureResults" variant="outlined" class="pa-4">
                  <v-card-title class="text-h6 mb-2 d-flex align-center">
                    <v-icon start>mdi-file-tree</v-icon>
                    <span>DOM Structure</span>
                    <v-spacer></v-spacer>
                    <v-btn-toggle v-model="structureViewMode" density="compact" variant="outlined">
                      <v-btn value="tree" prepend-icon="mdi-file-tree">Tree</v-btn>
                      <v-btn value="map" prepend-icon="mdi-view-grid">Map</v-btn>
                    </v-btn-toggle>
                  </v-card-title>
                  <v-card-text>
                    <div v-if="structureViewMode === 'tree'" style="max-height: 500px; overflow-y: auto;">
                      <div class="structure-tree">
                        <v-list density="compact">
                          <template v-for="(node, index) in structureResults.tree" :key="index">
                            <div class="node-wrapper">
                              <div class="tree-node" :style="`padding-left: ${node.depth * 20}px`"
                                @click="toggleNode(`root-${index}`)"
                                :class="{ 'clickable': node.children && node.children.length > 0 }">
                                <v-icon size="small" :color="getElementColor(node.tag)" class="mr-2">
                                  {{ node.children && node.children.length > 0 ?
                                    (expandedNodes[`root-${index}`] ? 'mdi-chevron-down' : 'mdi-chevron-right') :
                                    'mdi-code-tags' }}
                                </v-icon>
                                <span class="tag-name">&lt;{{ node.tag }}&gt;</span>
                                <span v-if="node.id" class="text-caption ml-2">#{{ node.id }}</span>
                                <span v-if="node.class" class="text-caption ml-2">.{{ node.class }}</span>
                                <span class="text-caption ml-2">({{ node.childCount }} children)</span>
                              </div>
                              <div v-if="node.children && node.children.length > 0 && expandedNodes[`root-${index}`]"
                                class="node-children">
                                <template v-for="(child, childIndex) in node.children"
                                  :key="`child-${index}-${childIndex}`">
                                  <div class="node-wrapper">
                                    <div class="tree-node" :style="`padding-left: ${(child.depth) * 20}px`"
                                      @click.stop="toggleNode(`root-${index}-${childIndex}`)"
                                      :class="{ 'clickable': child.children && child.children.length > 0 }">
                                      <v-icon size="small" :color="getElementColor(child.tag)" class="mr-2">
                                        {{ child.children && child.children.length > 0 ?
                                          (expandedNodes[`root-${index}-${childIndex}`] ? 'mdi-chevron-down' :
                                            'mdi-chevron-right') :
                                          'mdi-code-tags' }}
                                      </v-icon>
                                      <span class="tag-name">&lt;{{ child.tag }}&gt;</span>
                                      <span v-if="child.id" class="text-caption ml-2">#{{ child.id }}</span>
                                      <span v-if="child.class" class="text-caption ml-2">.{{ child.class }}</span>
                                      <span class="text-caption ml-2">({{ child.childCount }} children)</span>
                                    </div>
                                    <div
                                      v-if="child.children && child.children.length > 0 && expandedNodes[`root-${index}-${childIndex}`]"
                                      class="child-children" style="padding-left: 20px">
                                      <div v-for="(grandChild, gcIndex) in child.children"
                                        :key="`grandchild-${index}-${childIndex}-${gcIndex}`" class="tree-node"
                                        :style="`padding-left: ${(grandChild.depth) * 20}px`">
                                        <v-icon size="small" :color="getElementColor(grandChild.tag)"
                                          class="mr-2">mdi-code-tags</v-icon>
                                        <span class="tag-name">&lt;{{ grandChild.tag }}&gt;</span>
                                        <span v-if="grandChild.id" class="text-caption ml-2">#{{ grandChild.id }}</span>
                                        <span v-if="grandChild.class" class="text-caption ml-2">.{{ grandChild.class
                                        }}</span>
                                        <span class="text-caption ml-2">({{ grandChild.childCount }} children)</span>
                                      </div>
                                    </div>
                                  </div>
                                </template>
                              </div>
                            </div>
                          </template>
                        </v-list>
                      </div>
                    </div>
                    <div v-else class="structure-map" style="height: 500px; overflow-y: auto;">
                      <div class="d-flex flex-wrap">
                        <div v-for="(node, index) in structureResults.flatTree" :key="index"
                          class="element-block pa-1 ma-1 rounded-sm text-caption text-white text-center"
                          :style="`background-color: ${getElementColor(node.tag)}; width: ${Math.max(30, node.children * 5)}px; height: ${Math.max(30, node.depth * 5)}px;`"
                          :title="`<${node.tag}> (${node.children} children, depth: ${node.depth})`">
                          {{ node.tag }}
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-8 rounded-lg" elevation="3">
          <v-card-title class="text-h6 pa-4 bg-deep-purple text-white">
            <v-icon size="large" class="mr-2">mdi-access-point</v-icon>
            ARIA Accessibility Checker
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4 mb-4">
                  <v-card-title class="text-h6 mb-2">
                    <v-icon start>mdi-web</v-icon>
                    Analyze URL
                  </v-card-title>
                  <v-card-text>
                    <v-text-field v-model="ariaUrl" label="Enter URL to check ARIA attributes" variant="outlined"
                      density="comfortable" placeholder="https://example.com"
                      @keyup.enter="analyzeAriaAttributes"></v-text-field>
                    <premium-feature v-if="!isPremium" title="ARIA attributes analysis" icon="mdi-web" color="primary"
                      feature-key="accessibility" />
                    <v-btn v-if="isPremium" color="primary" prepend-icon="mdi-magnify" @click="analyzeAriaAttributes"
                      :loading="ariaLoading" :disabled="!ariaUrl" block class="mt-4">
                      Check ARIA Attributes
                    </v-btn>
                  </v-card-text>
                </v-card>

                <v-card v-if="ariaResults" variant="outlined" class="pa-4">
                  <v-card-title class="d-flex align-center">
                    <span>ARIA Score</span>
                    <v-spacer></v-spacer>
                    <v-progress-circular :model-value="ariaResults.score.toString()"
                      :color="getScoreColor(ariaResults.score)" size="60" width="8">
                      <span class="text-subtitle-2 font-weight-bold">{{ ariaResults.score }}%</span>
                    </v-progress-circular>
                  </v-card-title>

                  <v-card-text>
                    <div class="d-flex justify-space-between mb-4">
                      <div class="text-center">
                        <div class="text-h4 font-weight-bold"
                          :class="ariaResults.missingAriaCount > 0 ? 'text-warning' : 'text-success'">
                          {{ ariaResults.missingAriaCount }}
                        </div>
                        <div class="text-caption">Missing ARIA</div>
                      </div>
                      <div class="text-center">
                        <div class="text-h4 font-weight-bold"
                          :class="ariaResults.missingLabels > 0 ? 'text-warning' : 'text-success'">
                          {{ ariaResults.missingLabels }}
                        </div>
                        <div class="text-caption">Missing Labels</div>
                      </div>
                      <div class="text-center">
                        <div class="text-h4 font-weight-bold"
                          :class="ariaResults.invalidAriaCount > 0 ? 'text-error' : 'text-success'">
                          {{ ariaResults.invalidAriaCount }}
                        </div>
                        <div class="text-caption">Invalid ARIA</div>
                      </div>
                    </div>

                    <v-list density="compact">
                      <v-list-subheader>Element Analysis</v-list-subheader>
                      <v-list-item title="Interactive Elements"
                        :subtitle="`${ariaResults.interactiveElementsCount} elements found`">
                        <template v-slot:prepend>
                          <v-icon :color="ariaResults.interactiveElementsWithAriaPercent >= 80 ? 'success' : 'warning'">
                            {{ ariaResults.interactiveElementsWithAriaPercent >= 80 ? 'mdi-check-circle' :
                              'mdi-alert-circle' }}
                          </v-icon>
                        </template>
                        <template v-slot:append>
                          <v-chip size="small"
                            :color="ariaResults.interactiveElementsWithAriaPercent >= 80 ? 'success' : 'warning'">
                            {{ ariaResults.interactiveElementsWithAriaPercent }}% have ARIA
                          </v-chip>
                        </template>
                      </v-list-item>
                      <v-list-item title="Form Controls" :subtitle="`${ariaResults.formElementsCount} elements found`">
                        <template v-slot:prepend>
                          <v-icon :color="ariaResults.formElementsWithLabelsPercent >= 90 ? 'success' : 'warning'">
                            {{ ariaResults.formElementsWithLabelsPercent >= 90 ? 'mdi-check-circle' : 'mdi-alert-circle'
                            }}
                          </v-icon>
                        </template>
                        <template v-slot:append>
                          <v-chip size="small"
                            :color="ariaResults.formElementsWithLabelsPercent >= 90 ? 'success' : 'warning'">
                            {{ ariaResults.formElementsWithLabelsPercent }}% have labels
                          </v-chip>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card v-if="ariaResults && ariaResults.issues.length > 0" variant="outlined" class="pa-4 mb-4">
                  <v-card-title class="text-h6 mb-2">
                    <v-icon start>mdi-alert-circle</v-icon>
                    ARIA Issues ({{ ariaResults.issues.length }})
                  </v-card-title>
                  <v-card-text>
                    <v-expansion-panels>
                      <v-expansion-panel v-for="(issue, index) in ariaResults.issues" :key="index">
                        <v-expansion-panel-title>
                          <div class="d-flex align-center">
                            <v-icon :color="issue.severity === 'critical' ? 'error' : 'warning'" class="mr-2">
                              {{ issue.severity === 'critical' ? 'mdi-alert-circle' : 'mdi-alert' }}
                            </v-icon>
                            <div>{{ issue.element }}</div>
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <div class="pa-2">
                            <div class="font-weight-medium mb-2">{{ issue.issue }}</div>
                            <v-alert type="info" variant="tonal" class="mb-2">
                              {{ issue.suggestion }}
                            </v-alert>
                            <div v-if="issue.code" class="mt-2 pa-3 bg-grey-lighten-4 rounded-lg">
                              <pre><code>{{ issue.code }}</code></pre>
                            </div>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card-text>
                </v-card>

                <v-card v-if="ariaResults" variant="outlined" class="pa-4">
                  <v-card-title class="text-h6 mb-2">
                    <v-icon start>mdi-book-open-variant</v-icon>
                    ARIA Best Practices
                  </v-card-title>
                  <v-card-text>
                    <v-alert type="info" variant="tonal" class="mb-4">
                      The following are key ARIA practices to consider for your website:
                    </v-alert>
                    <v-list density="compact">
                      <v-list-item prepend-icon="mdi-text-box-check" title="Use Semantic HTML"
                        subtitle="Prefer native HTML elements with built-in accessibility over custom elements with ARIA">
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-label" title="Label Everything"
                        subtitle="All form fields and interactive elements should have appropriate labels">
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-image" title="Alt Text for Images"
                        subtitle="All images should have meaningful alt text (or empty alt for decorative images)">
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-keyboard" title="Keyboard Navigation"
                        subtitle="Ensure all interactive elements are keyboard accessible">
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-arrange-send-backward" title="Focus Management"
                        subtitle="Manage focus appropriately in interactive components">
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import premiumFeature from '../components/PremiumFeature.vue';
import { useUserStore } from '../stores/userStore';

// @ts-ignore
import { definePageMeta, useHead } from '#imports';

const userStore = useUserStore();

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: 'Accessibility - StackUnity',
  meta: [
    { name: 'description', content: 'Accessibility tools for web developers' },
    { name: 'keywords', content: 'accessibility, web accessibility, web accessibility tools, accessibility testing, web accessibility testing, accessibility guidelines, web accessibility guidelines, accessibility best practices, web accessibility best practices' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Accessibility - StackUnity' },
    { name: 'og:description', content: 'Accessibility tools for web developers' },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/accessibility' }
  ]
});

const textColor = ref('rgb(33, 33, 33)');
const backgroundColor = ref('rgb(255, 255, 255)');
const contrast = ref(0);

const textColorPicker = ref('#212121');
const backgroundColorPicker = ref('#FFFFFF');

const semanticUrl = ref('');
const semanticLoading = ref(false);
const semanticResults = ref<any>(null);

const metaUrl = ref('');
const metaLoading = ref(false);
const metaResults = ref<any>(null);

const structureUrl = ref('');
const structureLoading = ref(false);
const structureResults = ref<any>(null);

const ariaUrl = ref('');
const ariaLoading = ref(false);
const ariaResults = ref<any>(null);
const isPremium = ref(userStore.user?.isPremium || false);

watch(() => userStore.isAuthenticated, () => {
  if (userStore.user) {
    isPremium.value = userStore.user.isPremium || false;
  } else {
    isPremium.value = false;
  }
});

const structureViewMode = ref('tree');

const expandedNodes = reactive<Record<string, boolean>>({});

const toggleNode = (nodeId: string) => {
  expandedNodes[nodeId] = !expandedNodes[nodeId];
};

const updateTextColor = (color: any) => {
  if (color && typeof color === 'string' && color.startsWith('#') && (color.length === 7 || color.length === 9)) {
    textColor.value = color;
    getContrast();
  } else if (color && color.hasOwnProperty('h') && color.hasOwnProperty('a')) {
    const rgba = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`;
    textColor.value = rgba;
    getContrast();
  }
};

const updateBackgroundColor = (color: any) => {
  if (color && typeof color === 'string' && color.startsWith('#') && (color.length === 7 || color.length === 9)) {
    backgroundColor.value = color;
    getContrast();
  } else if (color && color.hasOwnProperty('h') && color.hasOwnProperty('a')) {
    const rgba = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`;
    backgroundColor.value = rgba;
    getContrast();
  }
};

const textColorFromField = (value: string) => {
  const hexValue = convertToHex(value);
  if (hexValue && hexValue.length >= 4) {
    textColorPicker.value = hexValue;
  }
  getContrast();
};

const backgroundColorFromField = (value: string) => {
  const hexValue = convertToHex(value);
  if (hexValue && hexValue.length >= 4) {
    backgroundColorPicker.value = hexValue;
  }
  getContrast();
};

const convertToHex = (colorStr: string): string => {
  if (!colorStr || colorStr === '#') {
    return '#000000';
  }

  if (colorStr.startsWith('#')) {
    if (colorStr.length === 4 || colorStr.length === 7) {
      if (colorStr.length === 4) {
        return `#${colorStr[1]}${colorStr[1]}${colorStr[2]}${colorStr[2]}${colorStr[3]}${colorStr[3]}`;
      }
      return colorStr;
    } else {
      return '#000000';
    }
  }

  if (typeof document !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.style.color = colorStr;
    document.body.appendChild(tempDiv);
    const computedColor = getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    const rgbMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  }

  return colorStr;
};

const getContrast = async () => {
  const srgbText = extractRGB(textColor.value);
  const srgbBackground = extractRGB(backgroundColor.value);
  console.log("Couleurs extraites:", srgbText, srgbBackground);

  if (srgbText && srgbBackground) {
    const contrastRatio = calculateContrastRatio(srgbText, srgbBackground);
    contrast.value = contrastRatio;
    console.log("Ratio de contraste:", contrastRatio);
  }
}

function extractRGB(color: string) {
  const trimmed = color.trim();

  if (trimmed.startsWith('#')) {
    let hex = trimmed.substring(1);


    if (hex.length === 3) {
      hex = hex.split('').map(h => h + h).join('');
    }

    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      return { red: r, green: g, blue: b };
    }
  }

  const rgbMatch = trimmed.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/i);
  if (rgbMatch) {
    return {
      red: parseInt(rgbMatch[1], 10) / 255,
      green: parseInt(rgbMatch[2], 10) / 255,
      blue: parseInt(rgbMatch[3], 10) / 255
    };
  }

  const hslMatch = trimmed.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*[\d.]+)?\s*\)/i);
  if (hslMatch) {
    return hslToRgb(
      parseInt(hslMatch[1], 10) / 360,
      parseInt(hslMatch[2], 10) / 100,
      parseInt(hslMatch[3], 10) / 100
    );
  }

  if (typeof document !== 'undefined') {
    const tempEl = document.createElement('div');
    tempEl.style.color = trimmed;
    document.body.appendChild(tempEl);
    const computedColor = getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);

    const match = computedColor.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/i);
    if (match) {
      return {
        red: parseInt(match[1], 10) / 255,
        green: parseInt(match[2], 10) / 255,
        blue: parseInt(match[3], 10) / 255
      };
    }
  }

  console.error("Format de couleur non reconnu:", color);
  return null;
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    red: Math.min(1, Math.max(0, r)),
    green: Math.min(1, Math.max(0, g)),
    blue: Math.min(1, Math.max(0, b))
  };
}

function calculateLuminance(srgb: { red: number, green: number, blue: number }) {
  const r = Math.min(1, Math.max(0, srgb.red));
  const g = Math.min(1, Math.max(0, srgb.green));
  const b = Math.min(1, Math.max(0, srgb.blue));

  const transform = (channel: number) =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);

  const R = transform(r);
  const G = transform(g);
  const B = transform(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function calculateContrastRatio(srgbText: { red: number, green: number, blue: number }, srgbBackground: { red: number, green: number, blue: number }) {
  const luminanceText = calculateLuminance(srgbText);
  const luminanceBackground = calculateLuminance(srgbBackground);
  const brighter = Math.max(luminanceText, luminanceBackground);
  const darker = Math.min(luminanceText, luminanceBackground);
  return (brighter + 0.05) / (darker + 0.05);
}

interface Item {
  [key: string]: any;
}

interface Category {
  description: string;
  count: number;
  items: Item;
}

interface ResponseData {
  status: {
    success: boolean;
    httpstatuscode: number;
  };
  statistics: {
    allitemcount: number;
    creditsremaining: number;
    pagetitle: string;
    pageurl: string;
    time: number;
    totalelements: number;
    waveurl: string;
  };
  categories: {
    error: Category;
    contrast: Category;
    alert: Category;
    feature: Category;
    structure: Category;
    aria: Category;
    [key: string]: Category;
  };
}

const analyzeSemanticStructure = async () => {
  if (!semanticUrl.value) return;

  semanticLoading.value = true;
  try {
    const response = await fetch('/api/analyze/semantic-analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({ url: semanticUrl.value })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    semanticResults.value = data;
    console.log(semanticResults.value);
  } catch (error) {
    console.error('Error analyzing semantic structure:', error);
  } finally {
    semanticLoading.value = false;
  }
};

const getElementTitle = (key: any): string => {
  const mapping: Record<string, string> = {
    hasHeader: 'Header Element',
    hasMain: 'Main Element',
    hasFooter: 'Footer Element',
    hasNav: 'Navigation Element',
    hasArticle: 'Article Element',
    hasSection: 'Section Element',
    hasAside: 'Aside Element',
    hasFigure: 'Figure Element',
    validH1Usage: 'Proper H1 Usage',
    validHeadingStructure: 'Valid Heading Structure'
  };

  const keyStr = String(key);
  return mapping[keyStr] || keyStr;
};

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'success';
  if (score >= 70) return 'info';
  if (score >= 50) return 'warning';
  return 'error';
};

const getReadabilityColor = (score: number): string => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'error';
};

const getHeadingColor = (level: number): string => {
  const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];
  return colors[level - 1] || 'grey';
};

const analyzeMetaTags = async () => {
  if (!metaUrl.value) return;

  metaLoading.value = true;
  try {
    const response = await fetch('/api/analyze/semantic-analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({ url: metaUrl.value, type: 'meta' })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    metaResults.value = data;
    console.log(metaResults.value);
  } catch (error) {
    console.error('Error analyzing meta tags:', error);
  } finally {
    metaLoading.value = false;
  }
};

const analyzeHtmlStructure = async () => {
  if (!structureUrl.value) return;

  structureLoading.value = true;
  try {
    const response = await fetch('/api/analyze/semantic-analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({ url: structureUrl.value, type: 'structure' })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    structureResults.value = data;
    console.log(structureResults.value);
  } catch (error) {
    console.error('Error analyzing HTML structure:', error);
  } finally {
    structureLoading.value = false;
  }
};

const analyzeAriaAttributes = async () => {
  if (!ariaUrl.value) return;

  ariaLoading.value = true;
  try {
    const response = await fetch('/api/analyze/semantic-analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({ url: ariaUrl.value, type: 'aria' })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    ariaResults.value = data;
    console.log(ariaResults.value);
  } catch (error) {
    console.error('Error analyzing ARIA attributes:', error);
  } finally {
    ariaLoading.value = false;
  }
};

function getElementColor(tag: string | number): string {
  const tagStr = String(tag);
  const semanticElements = ['header', 'main', 'footer', 'article', 'section', 'nav', 'aside', 'figure', 'figcaption', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  if (semanticElements.includes(tagStr)) {
    return 'success';
  } else if (tagStr === 'div') {
    return 'grey';
  } else if (tagStr === 'a' || tagStr === 'button' || tagStr === 'input' || tagStr === 'form') {
    return 'primary';
  } else if (tagStr === 'img' || tagStr === 'video') {
    return 'info';
  } else {
    return 'grey-lighten-1';
  }
}

</script>

<style scoped>
.v-color-picker {
  max-width: 100%;
  margin: 0 auto;
}

.structure-tree {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}

.structure-item {
  padding: 4px;
  margin: 2px 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.semantic-element {
  background-color: rgba(76, 175, 80, 0.08);
}

.tag-name {
  font-family: monospace;
  font-weight: bold;
}

.code-block {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 4px;
  font-family: monospace;
  max-height: 200px;
  overflow-y: auto;
}

.tree-node {
  padding: 4px;
  margin: 2px 0;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}

.tree-node:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.clickable {
  cursor: pointer;
}

.node-children {
  margin-left: 10px;
}
</style>