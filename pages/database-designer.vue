<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-6">

        <v-tabs v-model="activeTab" color="primary" align-tabs="center">
          <v-tab value="config" class="text-subtitle-1">
            <v-icon start>mdi-cog</v-icon>
            {{ t().tabs.config }}
          </v-tab>
          <v-tab value="templates" class="text-subtitle-1">
            <v-icon start>mdi-file-document-multiple</v-icon>
            {{ t().tabs.templates }}
          </v-tab>
        </v-tabs>

        <v-row class="mt-6">
          <v-window v-model="activeTab" class="w-100">
            <v-window-item value="config">
              <v-row>
                <v-col cols="12" lg="5">
                  <v-card class="mb-4 rounded-lg" elevation="2">
                    <v-card-text>
                      <div class="text-h6 mb-2 d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-database</v-icon>
                        {{ t().database.settings }}
                      </div>
                      <v-divider class="mb-4"></v-divider>

                      <v-text-field v-model="databaseName" :label="t().database.name" variant="outlined"
                        prepend-inner-icon="mdi-database-edit" :placeholder="t().database.namePlaceholder" class="mb-4"
                        hide-details></v-text-field>

                      <v-select v-model="selectedSchemaId" :items="availableSchemas" item-title="title"
                        item-value="value" :label="t().database.loadSchema" variant="outlined" class="mb-4"
                        prepend-inner-icon="mdi-folder-open" @update:model-value="handleSchemaSelection" hide-details
                        :loading="isLoadingSchemas"></v-select>

                      <div class="d-flex flex-wrap">
                        <v-btn color="primary" @click="addTable" prepend-icon="mdi-table-plus" variant="tonal"
                          class="mr-2 mb-2">
                          {{ t().table.add }}
                        </v-btn>
                        <v-btn color="success" @click="saveSQLSchema" prepend-icon="mdi-content-save" variant="tonal"
                          class="mr-2 mb-2">
                          {{ t().actions.save }}
                        </v-btn>
                        <v-menu>
                          <template v-slot:activator="{ props }">
                            <v-btn color="info" prepend-icon="mdi-export" variant="tonal" class="mr-2 mb-2"
                              v-bind="props">
                              {{ t().actions.export }}
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item @click="exportDatabase('json')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-code-json</v-icon>
                                {{ t().export.json }}
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="exportDatabase('sql')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-database</v-icon>
                                {{ t().export.sql }}
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="exportDatabase('schema')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-file-document</v-icon>
                                {{ t().export.schema }}
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                        <v-btn color="warning" @click="importSQLFiles" prepend-icon="mdi-folder-open" variant="tonal"
                          class="mr-2 mb-2">
                          {{ t().actions.import }}
                        </v-btn>
                        <v-btn color="error" @click="deleteSQLSchema" prepend-icon="mdi-delete" variant="tonal"
                          class="mb-2">
                          {{ t().actions.delete }}
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>

                  <v-card v-if="generatedSQL" class="rounded-lg" elevation="2">
                    <v-card-title
                      class="d-flex justify-space-between align-center bg-primary text-white py-3 px-4 rounded-t-lg">
                      <div class="d-flex align-center">
                        <v-icon color="white" class="mr-2">mdi-code-braces</v-icon>
                        {{ t().export.title }}
                      </div>
                      <div class="d-flex">
                        <v-menu>
                          <template v-slot:activator="{ props }">
                            <v-btn icon color="white" variant="text" class="mr-2" v-bind="props">
                              <v-icon>mdi-database-convert</v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item @click="convertToNoSQLHandler('mongodb')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-poll</v-icon>
                                MongoDB
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="convertToNoSQLHandler('firestore')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-firebase</v-icon>
                                Firestore
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="convertToNoSQLHandler('dynamodb')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-aws</v-icon>
                                DynamoDB
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                        <v-menu>
                          <template v-slot:activator="{ props }">
                            <v-btn icon color="white" variant="text" class="mr-2" v-bind="props">
                              <v-icon>mdi-code-json</v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item @click="convertToORMHandler('sequelize')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-nodejs</v-icon>
                                Sequelize
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="convertToORMHandler('typeorm')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-language-typescript</v-icon>
                                TypeORM
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="convertToORMHandler('prisma')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-triangle</v-icon>
                                Prisma
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="convertToORMHandler('mongoose')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-leaf</v-icon>
                                Mongoose
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                        <v-btn icon color="white" @click="copySQL" variant="text">
                          <v-icon>mdi-content-copy</v-icon>
                        </v-btn>
                      </div>
                    </v-card-title>
                    <v-card-text class="pa-0">
                      <div class="bg-grey-darken-4 rounded-b-lg" style="max-height: 500px; overflow-y: auto;">
                        <pre class="pa-4 ma-0 overflow-x-auto"><code v-html="highlightedSQL"
          class="font-family-monospace text-body-2"></code></pre>
                      </div>
                    </v-card-text>
                    <v-card-actions class="pa-4 pt-0 mt-3">
                      <v-btn color="primary" block @click="generateSQL" prepend-icon="mdi-refresh" variant="tonal">
                        {{ t().actions.regenerate }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col cols="12" lg="7">
                  <v-card class="rounded-lg" elevation="2">
                    <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                      <v-icon color="white" class="mr-2">mdi-table-multiple</v-icon>
                      {{ t().table.tables }}
                      <v-spacer></v-spacer>
                      <v-btn v-if="!generatedSQL" color="white" variant="text" @click="generateSQL"
                        prepend-icon="mdi-play">
                        {{ t().actions.generate }}
                      </v-btn>
                    </v-card-title>

                    <v-card-text class="pa-4">
                      <div v-if="tables.length === 0" class="text-center pa-8">
                        <v-icon size="64" color="grey-lighten-1">mdi-table-plus</v-icon>
                        <div class="text-h6 mt-4 text-grey">{{ t().database.noTables }}</div>
                        <div class="text-body-1 text-grey-darken-1 mb-4">{{ t().database.startAdding }}</div>
                        <v-btn color="primary" variant="tonal" @click="addTable" prepend-icon="mdi-table-plus">
                          {{ t().table.add }}
                        </v-btn>
                      </div>

                      <v-expansion-panels v-else variant="accordion" multiple>
                        <v-expansion-panel v-for="(table, index) in tables" :key="index"
                          class="mb-4 rounded-lg border border-grey-lighten-2 hover-border-primary transition-all"
                          :title="table.name || t().table.unnamed">
                          <template v-slot:title>
                            <div class="d-flex align-center">
                              <v-icon color="primary" class="mr-2">mdi-table</v-icon>
                              <span class="text-subtitle-1">{{ table.name || t().table.unnamed }}</span>
                              <v-chip class="ml-2" size="small" color="grey-lighten-3">
                                {{ table.columns.length }} column{{ table.columns.length !== 1 ? 's' : '' }}
                              </v-chip>
                            </div>
                          </template>

                          <v-expansion-panel-text>
                            <v-text-field v-model="table.name" :label="t().table.name" variant="outlined"
                              prepend-inner-icon="mdi-table-edit" :placeholder="t().table.namePlaceholder"
                              class="mb-4"></v-text-field>

                            <div class="d-flex justify-space-between align-center mb-3">
                              <div class="text-subtitle-1 font-weight-bold d-flex align-center">
                                <v-icon color="primary" class="mr-2">mdi-table-column</v-icon>
                                {{ t().column.name }}
                              </div>
                              <v-btn color="primary" size="small" variant="tonal" @click="addColumn(table)"
                                prepend-icon="mdi-plus">
                                {{ t().column.add }}
                              </v-btn>
                            </div>

                            <v-divider class="mb-4"></v-divider>

                            <div v-if="table.columns.length === 0"
                              class="text-center pa-4 bg-grey-lighten-4 rounded-lg mb-4">
                              <v-icon color="grey">mdi-table-column-plus-after</v-icon>
                              <div class="text-body-2 text-grey-darken-1 mt-2">No columns defined</div>
                            </div>

                            <v-card v-for="(column, colIndex) in table.columns" :key="colIndex" variant="outlined"
                              class="mb-3 hover-elevate-1 transition-all" :color="getColumnCardColor(column)">
                              <v-card-text class="pa-3">
                                <div class="d-flex flex-wrap align-center">
                                  <v-text-field v-model="column.name" label="Name" variant="outlined" density="compact"
                                    class="flex-grow-1 min-width-150 mr-3 mb-2" hide-details
                                    :error="column.name ? !validateColumnName(column.name) : false"
                                    :error-messages="column.name && !validateColumnName(column.name) ? 'Les emojis ne sont pas autorisés' : ''">
                                  </v-text-field>

                                  <v-select v-model="column.type" :items="sqlTypes" label="Type" variant="outlined"
                                    density="compact" class="flex-grow-1 min-width-150 mr-3 mb-2"
                                    hide-details></v-select>

                                  <v-select v-model="column.constraints" :items="constraints" item-title="title"
                                    item-value="value" label="Constraints" variant="outlined" density="compact" multiple
                                    chips class="flex-grow-1 min-width-150 mr-3 mb-2" hide-details
                                    @update:model-value="(val: string[]) => updateConstraints(val, column)"></v-select>

                                  <div v-if="column.constraints?.includes('default')"
                                    class="d-flex flex-wrap align-center bg-orange-lighten-5 rounded-lg pa-3 mt-3">
                                    <v-icon color="orange-darken-1" class="mr-3">mdi-format-quote-close</v-icon>

                                    <v-select v-model="column.defaultType" :items="defaultValueOptions"
                                      item-title="title" item-value="value" label="Default value type"
                                      variant="outlined" density="compact" class="flex-grow-1 min-width-150 mr-3 mb-2"
                                      hide-details @update:model-value="updateDefaultValue(column, $event as string)">
                                    </v-select>

                                    <v-text-field v-if="column.defaultType === 'custom'" v-model="column.default"
                                      label="Default value" variant="outlined" density="compact"
                                      class="flex-grow-1 min-width-150" hide-details>
                                    </v-text-field>
                                  </div>

                                  <v-btn color="error" icon variant="text" density="compact"
                                    @click="removeColumn(table, colIndex)">
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </div>

                                <div v-if="column.foreignKey"
                                  class="d-flex flex-wrap align-center bg-blue-lighten-5 rounded-lg pa-3 mt-3">
                                  <v-icon color="blue-darken-1" class="mr-3">mdi-link-variant</v-icon>
                                  <v-select v-model="column.referencedTable"
                                    :items="tables.filter(t => t.name && t.name !== table.name).map(t => t.name)"
                                    label="Referenced table" variant="outlined" density="compact"
                                    class="flex-grow-1 min-width-150 mr-3 mb-2" hide-details
                                    prepend-inner-icon="mdi-table"></v-select>
                                  <v-select v-model="column.referencedColumn"
                                    :items="getReferencedColumns(column.referencedTable || '')"
                                    label="Referenced column" variant="outlined" density="compact"
                                    class="flex-grow-1 min-width-150 mb-2" hide-details
                                    prepend-inner-icon="mdi-table-column"
                                    :disabled="!column.referencedTable"></v-select>
                                </div>
                              </v-card-text>
                            </v-card>

                            <div class="d-flex justify-end mt-3">
                              <v-btn color="error" variant="text" @click="removeTable(index)" prepend-icon="mdi-delete"
                                size="small">
                                {{ t().table.delete }}
                              </v-btn>
                            </div>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item value="templates">
              <v-row>
                <v-col cols="12" md="4" lg="3">
                  <v-card class="rounded-lg" elevation="2">
                    <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                      <v-icon color="white" class="mr-2">mdi-file-document-multiple</v-icon>
                      {{ t().templates.title }}
                    </v-card-title>
                    <v-card-text class="py-4">
                      <p class="text-body-2 mb-4">{{ t().templates.description }}</p>
                      <v-alert color="info" variant="tonal" class="mb-4">
                        <div class="text-body-2">
                          <v-icon color="info" class="mr-1">mdi-information</v-icon>
                          {{ t().templates.info }}
                        </div>
                      </v-alert>
                      <v-list lines="two">
                        <v-list-item v-for="template in sqlTemplateOptions" :key="template.value"
                          @click="applyTemplate(template.value)" class="mb-2" rounded elevation="1">
                          <template v-slot:prepend>
                            <v-avatar color="primary" variant="tonal">
                              <v-icon>mdi-database-outline</v-icon>
                            </v-avatar>
                          </template>
                          <v-list-item-title>{{ getTemplateTitle(template.value) }}</v-list-item-title>
                          <v-list-item-subtitle>{{ getTemplateDescription(template.value) }}</v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="8" lg="9">
                  <v-card class="rounded-lg" elevation="2">
                    <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                      <v-icon color="white" class="mr-2">mdi-file-eye</v-icon>
                      {{ t().templates.title }}
                    </v-card-title>
                    <v-card-text class="pa-4">
                      <div v-if="!selectedTemplate" class="text-center pa-8">
                        <v-icon size="64" color="grey-lighten-1">mdi-database-search</v-icon>
                        <div class="text-h6 mt-4 text-grey">{{ t().templates.title }}</div>
                        <div class="text-body-1 text-grey-darken-1 mb-4">{{ t().templates.description }}</div>
                      </div>

                      <div v-else>
                        <div class="d-flex align-center mb-4">
                          <v-chip color="primary" variant="tonal" class="mr-2">{{ t().templates.title }}</v-chip>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" @click="applyTemplateToDatabase" prepend-icon="mdi-check"
                            variant="tonal">
                            {{ t().templates.load }}
                          </v-btn>
                        </div>

                        <v-alert color="info" variant="tonal" class="mb-4">
                          <div class="text-body-2">{{ getTemplateDescription(selectedTemplate ?
                            selectedTemplate.name.toLowerCase().replace(/\s+/g, '_') : '') }}</div>
                        </v-alert>

                        <div class="text-h6 mb-2 d-flex align-center">
                          <v-icon color="primary" class="mr-2">mdi-table-multiple</v-icon>
                          {{ t().table.tables }}
                        </div>

                        <v-expansion-panels variant="accordion" class="mb-4">
                          <v-expansion-panel v-for="table in selectedTemplate.tables" :key="table.name"
                            class="mb-2 rounded-lg border border-grey-lighten-2">
                            <v-expansion-panel-title>
                              <div class="d-flex align-center">
                                <v-icon color="primary" class="mr-2">mdi-table</v-icon>
                                <strong>{{ table.name }}</strong>
                                <v-chip size="small" color="grey" variant="tonal" class="ml-3">
                                  {{ t().templates.column_count.replace('{count}', table.columns.length) }}
                                </v-chip>
                              </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              <v-table density="compact" class="table-fixed">
                                <thead>
                                  <tr>
                                    <th>{{ t().column.name }}</th>
                                    <th>{{ t().column.type }}</th>
                                    <th>{{ t().column.nullable }}</th>
                                    <th>{{ t().column.default }}</th>
                                    <th>{{ t().column.attributes }}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="column in table.columns" :key="column.name"
                                    :class="{ 'primary-lighten-5': column.name === table.primaryKey }">
                                    <td>
                                      <div class="d-flex align-center">
                                        <strong>{{ column.name }}</strong>
                                      </div>
                                    </td>
                                    <td>{{ column.type }}</td>
                                    <td>
                                      <v-icon v-if="column.nullable" color="success" size="small">mdi-check</v-icon>
                                      <v-icon v-else color="error" size="small">mdi-close</v-icon>
                                    </td>
                                    <td>
                                      <template v-if="column.defaultType === 'NULL'">
                                        <span class="text-grey">NULL</span>
                                      </template>
                                      <template v-else-if="column.defaultType === 'CURRENT_TIMESTAMP'">
                                        <span class="text-blue-darken-1">CURRENT_TIMESTAMP</span>
                                      </template>
                                      <template v-else-if="column.default">
                                        <span class="text-orange-darken-2">'{{ column.default }}'</span>
                                      </template>
                                      <template v-else>-</template>
                                    </td>
                                    <td>
                                      <div class="d-flex flex-wrap">
                                        <v-chip v-if="column.unique" size="x-small" color="info" variant="tonal"
                                          class="mr-1 mb-1">
                                          {{ t().column.unique }}
                                        </v-chip>
                                        <v-chip v-if="column.autoIncrement" size="x-small" color="success"
                                          variant="tonal" class="mr-1 mb-1">
                                          {{ t().column.autoIncrement }}
                                        </v-chip>
                                        <v-chip v-if="column.primaryKey" size="x-small" color="warning" variant="tonal"
                                          class="mr-1 mb-1">
                                          {{ t().column.primaryKey }}
                                        </v-chip>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </v-table>

                              <div v-if="table.foreignKeys && table.foreignKeys.length > 0" class="mt-4">
                                <div class="text-subtitle-2 mb-2">{{ t().relations.title || "Foreign Keys" }}:</div>
                                <v-chip v-for="(fk, i) in table.foreignKeys" :key="i" color="secondary" variant="tonal"
                                  class="mr-2 mb-2">
                                  {{ fk.columns.join(', ') }} → {{ fk.referenceTable }}.{{ fk.referenceColumns.join(',')
                                  }}
                                </v-chip>
                              </div>

                              <div v-if="table.indices && table.indices.length > 0" class="mt-3">
                                <div class="text-subtitle-2 mb-2">{{ t().table.indices || "Indices" }}:</div>
                                <v-chip v-for="(idx, i) in table.indices" :key="i"
                                  :color="idx.unique ? 'warning' : 'grey'" variant="tonal" class="mr-2">
                                  {{ idx.name }}: {{ idx.columns.join(', ') }}
                                </v-chip>
                              </div>
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                        </v-expansion-panels>

                        <v-alert color="grey" variant="tonal" class="mb-2 mt-4">
                          <div class="text-body-2">
                            <v-icon color="info" class="mr-1">mdi-information</v-icon>
                            {{ t().templates.info }}
                          </div>
                        </v-alert>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item value="diagram">
              <v-row>
                <v-col cols="12">
                  <v-card class="rounded-lg" elevation="2">
                    <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                      <v-icon color="white" class="mr-2">mdi-chart-bubble</v-icon>
                      {{ t().tabs.diagram }}
                      <v-spacer></v-spacer>
                      <v-btn color="white" variant="text" @click="rearrangeTables">
                        <v-icon start>mdi-arrange-send-backward</v-icon>
                        {{ t().actions.rearrange || "Réorganiser" }}
                      </v-btn>
                      <v-btn color="white" variant="text" @click="exportDiagramImage">
                        <v-icon start>mdi-export</v-icon>
                        {{ t().actions.export }}
                      </v-btn>
                    </v-card-title>
                    <v-card-text class="pa-4">
                      <div v-if="tables.length === 0" class="text-center pa-8">
                        <v-icon size="64" color="grey-lighten-1">mdi-table-plus</v-icon>
                        <div class="text-h6 mt-4 text-grey">{{ t().database.noTables }}</div>
                        <div class="text-body-1 text-grey-darken-1 mb-4">{{ t().database.startAdding }}</div>
                        <v-btn color="primary" variant="tonal" @click="addTable" prepend-icon="mdi-table-plus">
                          {{ t().table.add }}
                        </v-btn>
                      </div>
                      <div v-else>
                        <div class="d-flex mb-4">
                          <v-btn-group>
                            <v-btn color="primary" variant="tonal" @click="zoomIn" prepend-icon="mdi-magnify-plus">
                              Zoom +
                            </v-btn>
                            <v-btn color="primary" variant="tonal" @click="zoomOut" prepend-icon="mdi-magnify-minus">
                              Zoom -
                            </v-btn>
                            <v-btn color="primary" variant="tonal" @click="resetZoom" prepend-icon="mdi-fit-to-page">
                              Reset
                            </v-btn>
                          </v-btn-group>
                          <v-spacer></v-spacer>
                          <v-select v-model="diagramLayout" :items="layoutOptions" label="Layout" density="compact"
                            class="max-width-200" hide-details @update:model-value="changeLayout"></v-select>
                        </div>
                        <div class="custom-diagram-container">
                          <div id="custom-diagram" class="custom-diagram" ref="customDiagram">
                            <div v-for="(table, index) in tables" :key="table.id" class="custom-table"
                              :style="getTablePosition(index)" @mousedown="startDrag($event, table)"
                              :id="`table-${table.id}`">
                              <div class="custom-table-header">
                                <div class="custom-table-title">{{ table.name || 'Sans nom' }}</div>
                                <div class="custom-table-actions">
                                  <v-icon size="small" @click="focusTable(table)" class="mr-1">mdi-magnify</v-icon>
                                </div>
                              </div>
                              <div class="custom-table-content">
                                <div v-for="column in table.columns" :key="column.name" class="custom-column"
                                  :class="{ 'primary-key': column.primaryKey, 'foreign-key': column.foreignKey }">
                                  <span class="custom-column-icon">
                                    <v-icon v-if="column.primaryKey" size="x-small"
                                      color="amber-darken-2">mdi-key</v-icon>
                                    <v-icon v-else-if="column.foreignKey" size="x-small"
                                      color="blue-darken-1">mdi-link-variant</v-icon>
                                    <v-icon v-else size="x-small" color="grey">mdi-circle-small</v-icon>
                                  </span>
                                  <span class="custom-column-name">{{ column.name }}</span>
                                  <span class="custom-column-type">{{ column.type }}</span>
                                </div>
                              </div>
                            </div>
                            <svg class="custom-relations">
                              <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5"
                                  orient="auto">
                                  <polygon points="0 0, 10 3.5, 0 7" fill="#2196F3" />
                                </marker>
                              </defs>
                              <g v-for="(table, tableIndex) in tables" :key="`rel-${table.id}`">
                                <template v-for="column in table.columns" :key="`rel-${table.id}-${column.name}`">
                                  <g v-if="column.foreignKey && column.referencedTable">
                                    <line :x1="getRelationCoords(table, column).x1"
                                      :y1="getRelationCoords(table, column).y1"
                                      :x2="getRelationCoords(table, column).x2"
                                      :y2="getRelationCoords(table, column).y2" stroke="#2196F3" stroke-width="2"
                                      marker-end="url(#arrowhead)" />
                                    <text :x="getRelationLabelPosition(table, column).x"
                                      :y="getRelationLabelPosition(table, column).y" fill="#333" font-size="12"
                                      text-anchor="middle">
                                      <tspan dy="-5" :x="getRelationLabelPosition(table, column).x">{{ column.name }}
                                      </tspan>
                                      <tspan dy="15" :x="getRelationLabelPosition(table, column).x">↓</tspan>
                                      <tspan dy="15" :x="getRelationLabelPosition(table, column).x">{{
                                        column.referencedColumn }}</tspan>
                                    </text>
                                  </g>
                                </template>
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-row>
      </v-container>
    </v-main>

    <snackBar v-model="showSnackbar" :text="snackbarText" :color="snackbarColor" :timeout="3000" />

    <!-- Remplacer l'input file existant par un input qui accepte les dossiers -->
    <input type="file" ref="fileInput" @change="handleFileImport" multiple accept=".sql" webkitdirectory directory
      style="display: none" />

    <!-- Dialog pour l'importation des fichiers SQL -->
    <v-dialog v-model="importDialog" max-width="700">
      <v-card>
        <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
          <v-icon color="white" class="mr-2">mdi-database-import</v-icon>
          {{ t().import.title || 'Import SQL Files' }}
        </v-card-title>
        <v-card-text class="pa-4">
          <v-alert v-if="importedFiles.length === 0" type="info" class="mb-4">
            {{ t().import.noFiles || 'No SQL files selected. Please select a folder containing SQL files to import.' }}
          </v-alert>

          <v-list v-else lines="two" class="mb-4">
            <v-list-subheader>{{ t().import.selectedFiles || 'Selected Files' }} ({{ importedFiles.length
            }})</v-list-subheader>
            <div v-if="importedFiles.length > 10" class="text-caption mb-2">
              Showing 10 of {{ importedFiles.length }} files
            </div>
            <v-list-item v-for="(file, index) in importedFiles.slice(0, 10)" :key="index">
              <template v-slot:prepend>
                <v-avatar color="primary" variant="tonal">
                  <v-icon>mdi-database</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title>{{ file.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ formatFileSize(file.size) }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-alert v-if="importError" type="error" class="mb-4">
            {{ importError }}
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-btn color="primary" variant="tonal" prepend-icon="mdi-folder-open" @click="selectFiles">
            {{ t().import.selectFiles || 'Select Folder' }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="importDialog = false">
            {{ t().actions.cancel || 'Cancel' }}
          </v-btn>
          <v-btn color="success" variant="tonal" @click="processImportedFiles" :disabled="importedFiles.length === 0"
            :loading="isImporting">
            {{ t().import.process || 'Process Files' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts" setup>
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import sql from 'highlight.js/lib/languages/sql';
import 'highlight.js/styles/atom-one-dark.css';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import snackBar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';
import { getSQLTemplate, getSQLTemplateNames } from '../utils/sqlTemplates';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { useTranslations } from '../languages';
import { Column, DatabaseType, SQLSchema, StoredTable, Table } from '../utils/sql/types';

const t = useTranslations('databaseDesigner');

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('sql', sql);

useHead({
  title: t().meta.title,
  meta: [
    { name: 'description', content: t().meta.description },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: t().meta.title },
    { name: 'og:description', content: t().meta.description },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
  ],
});

definePageMeta({
  layout: 'dashboard',
  ssr: false,
  requiresPremium: true
});

const userStore = useUserStore();
const activeTab = ref('config');
const databaseName = ref('my_database');
const tables = ref<Table[]>([]);
const selectedSchemaId = ref<number | null>(null);
const availableSchemas = ref<{ title: string; value: number | null }[]>([]);
const generatedSQL = ref('');
const selectedTemplate = ref<any>(null);
const isLoadingSchemas = ref(true);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('');

const route = useRoute();
const router = useRouter();

const sqlTemplateOptions = computed(() => {
  return getSQLTemplateNames();
});

const constraints = [
  { title: 'PRIMARY KEY', value: 'primaryKey' },
  { title: 'FOREIGN KEY', value: 'foreignKey' },
  { title: 'NOT NULL', value: 'notNull' },
  { title: 'UNIQUE', value: 'unique' },
  { title: 'AUTO_INCREMENT', value: 'autoIncrement' },
  { title: 'DEFAULT', value: 'default' },
];

const defaultValueOptions = [
  { title: 'NULL', value: 'NULL' },
  { title: 'CURRENT_TIMESTAMP', value: 'CURRENT_TIMESTAMP' },
  { title: 'Custom', value: 'custom' }
];

const sqlTypes = [
  'INT',
  'VARCHAR(255)',
  'TEXT',
  'MEDIUMTEXT',
  'LONGTEXT',
  'JSON',
  'DATE',
  'DATETIME',
  'TIMESTAMP',
  'BOOLEAN',
  'DECIMAL',
  'FLOAT',
  'ENUM'
];

const highlightedSQL = computed(() => {
  if (!generatedSQL.value) return '';
  return hljs.highlight(generatedSQL.value, {
    language: 'sql',
    ignoreIllegals: true
  }).value;
});

async function convertToNoSQLHandler(type: string) {
  try {
    const { convertToNoSQL } = await import('../utils/sql/nosql');

    const schema: SQLSchema = {
      database_name: databaseName.value,
      tables: tables.value
    };

    currentDatabaseType.value = DatabaseType.NOSQL;

    const result = convertToNoSQL(schema, {
      nosqlType: type as any,
      includeTimestamps: true
    });

    generatedSQL.value = result;

    setTimeout(() => {
      const codeElement = document.querySelector('.bg-grey-darken-4 pre code');
      if (codeElement) {
        codeElement.innerHTML = hljs.highlight(result, { language: 'javascript' }).value;
      }
    }, 0);

    snackbarText.value = `SQL converted to NoSQL (${type})`;
    snackbarColor.value = 'success';
    showSnackbar.value = true;
  } catch (error: any) {
    console.error('Error converting NoSQL:', error);

    snackbarText.value = `Error converting: ${error.message}`;
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
}

async function convertToORMHandler(type: string) {
  try {
    const { convertToORM } = await import('../utils/sql/orm');

    const schema: SQLSchema = {
      database_name: databaseName.value,
      tables: tables.value
    };

    currentDatabaseType.value = DatabaseType.ORM;

    const result = convertToORM(schema, {
      ormType: type as any,
      includeTimestamps: true
    });

    generatedSQL.value = result;

    setTimeout(() => {
      const codeElement = document.querySelector('.bg-grey-darken-4 pre code');
      if (codeElement) {
        codeElement.innerHTML = hljs.highlight(result, { language: 'javascript' }).value;
      }
    }, 0);

    snackbarText.value = `SQL converted to ORM (${type})`;
    snackbarColor.value = 'success';
    showSnackbar.value = true;
  } catch (error: any) {
    console.error('Error converting ORM:', error);

    snackbarText.value = `Error converting: ${error.message}`;
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
}

const loadSchemaNames = async () => {
  try {
    isLoadingSchemas.value = true;
    await userStore.loadSQLSchemas();

    console.log('Schemas loaded:', userStore.sqlSchemas);

    if (userStore.sqlSchemas && userStore.sqlSchemas.length > 0) {
      availableSchemas.value = (userStore.sqlSchemas as unknown as SQLSchema[]).map(schema => ({
        title: schema.database_name,
        value: schema.id ?? null
      }));

      availableSchemas.value.unshift({
        title: 'Create new schema',
        value: null
      });
    } else {
      console.warn('No SQL schemas found or schemas array is empty');
      availableSchemas.value = [{
        title: 'Create new schema',
        value: null
      }];
    }
  } catch (error) {
    console.error('Error loading schema names:', error);
    snackbarText.value = 'Erreur lors du chargement des schémas';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    isLoadingSchemas.value = false;
  }
};

watch(tables, (newTables) => {
  console.log('Tables updated:', newTables);
}, { deep: true });

const addTable = () => {
  tables.value.push({
    id: Math.random().toString(36).substring(2, 15),
    name: '',
    columns: [],
    foreignKeys: [],
    defaultOptions: []
  });
};

const removeTable = (index: number) => {
  tables.value.splice(index, 1);
};

const updateConstraints = (selectedConstraints: string[], column: Column) => {
  column.primaryKey = selectedConstraints.includes('primaryKey');
  column.foreignKey = selectedConstraints.includes('foreignKey');
  column.notNull = selectedConstraints.includes('notNull');
  column.unique = selectedConstraints.includes('unique');
  column.autoIncrement = selectedConstraints.includes('autoIncrement');

  if (selectedConstraints.includes('default')) {
    if (!column.defaultType) {
      column.defaultType = 'custom';
      column.default = '';
    }
  } else {
    column.defaultType = undefined;
    column.default = undefined;
  }

  if (!column.foreignKey) {
    column.referencedTable = '';
    column.referencedColumn = '';
  }
};

const updateDefaultValue = (column: Column, defaultType: string) => {
  column.defaultType = defaultType;

  if (defaultType === 'NULL') {
    column.default = 'NULL';
  } else if (defaultType === 'CURRENT_TIMESTAMP') {
    column.default = 'CURRENT_TIMESTAMP';
  } else if (defaultType === 'custom') {
    column.default = '';
  }
};

const addColumn = (table: Table) => {
  table.columns.push({
    name: '',
    type: 'VARCHAR(255)',
    nullable: false,
    primaryKey: false,
    foreignKey: false,
    notNull: false,
    unique: false,
    autoIncrement: false,
    referencedTable: '',
    referencedColumn: '',
    constraints: []
  });
};

const removeColumn = (table: Table, index: number) => {
  table.columns.splice(index, 1);
};

const getReferencedColumns = (tableName: string) => {
  const table = tables.value.find(t => t.name === tableName);
  return table?.columns.map(col => col.name) || [];
};

const getColumnCardColor = (column: Column) => {
  if (column.primaryKey) return 'yellow-lighten-4';
  if (column.foreignKey) return 'blue-lighten-4';
  return undefined;
};

const generateSQL = () => {
  let sql = `CREATE DATABASE IF NOT EXISTS ${databaseName.value};\n`;
  sql += `USE ${databaseName.value};\n\n`;

  tables.value.forEach(table => {
    sql += `CREATE TABLE ${table.name} (\n`;

    const columns = table.columns.map(col => {
      let colDef = `  ${col.name} ${col.type}`;

      if (col.notNull) colDef += ' NOT NULL';
      if (col.autoIncrement) colDef += ' AUTO_INCREMENT';
      if (col.primaryKey) colDef += ' PRIMARY KEY';
      if (col.unique) colDef += ' UNIQUE';
      if (col.constraints?.includes('default')) {
        if (col.defaultType === 'NULL') {
          colDef += ' DEFAULT NULL';
        } else if (col.defaultType === 'CURRENT_TIMESTAMP') {
          colDef += ' DEFAULT CURRENT_TIMESTAMP';
        } else if (col.default) {
          colDef += ` DEFAULT ${col.default}`;
        }
      }

      return colDef;
    });

    sql += columns.join(',\n');

    table.columns.forEach(col => {
      if (col.foreignKey && col.referencedTable && col.referencedColumn) {
        sql += `,\n  FOREIGN KEY (${col.name}) REFERENCES ${col.referencedTable}(${col.referencedColumn}) ON DELETE CASCADE`;
      }
    });

    sql += '\n);\n\n';
  });

  generatedSQL.value = sql;
};

const copySQL = async () => {
  try {
    await navigator.clipboard.writeText(generatedSQL.value);

    // Personnaliser le message selon le type de base de données
    let message = t().notifications.copied;

    if (currentDatabaseType.value === DatabaseType.NOSQL) {
      message = t().notifications.copied;
    } else if (currentDatabaseType.value === DatabaseType.ORM) {
      message = t().notifications.copied;
    }

    snackbarText.value = message;
    snackbarColor.value = 'success';
    showSnackbar.value = true;
  } catch (err) {
    console.error('Failed to copy code:', err);
    snackbarText.value = t().notifications.error;
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
};

const saveSQLSchema = async () => {
  if (!databaseName.value.trim()) {
    snackbarText.value = t().notifications.error;
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    return;
  }

  if (!tables.value.length) {
    snackbarText.value = t().notifications.error;
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    return;
  }

  const invalidTables = tables.value.filter(t => !t.name.trim() || !t.columns.length);
  if (invalidTables.length) {
    snackbarText.value = t().notifications.error;
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    return;
  }

  const hasInvalidColumns = tables.value.some(t =>
    t.columns.some(c => !c.name.trim() || (c.name && !validateColumnName(c.name)))
  );
  if (hasInvalidColumns) {
    snackbarText.value = t().notifications.error;
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    return;
  }

  try {
    await userStore.saveSQLSchema(databaseName.value, tables.value as any);
    snackbarText.value = t().notifications.saved;
    snackbarColor.value = 'success';
    showSnackbar.value = true;
    await userStore.loadSQLSchemas();
  } catch (err) {
    console.error('Error saving SQL schema:', err);
    snackbarText.value = t().notifications.error;
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
}

const deleteSQLSchema = async () => {
  if (!selectedSchemaId.value) {
    snackbarText.value = t().notifications.error;
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    return;
  }

  try {
    await userStore.deleteSQLSchema(selectedSchemaId.value);
    await userStore.loadSQLSchemas();
    snackbarText.value = t().notifications.deleted;
    snackbarColor.value = 'success';
    showSnackbar.value = true;

    databaseName.value = '';
    tables.value = [];
    selectedSchemaId.value = null;
    generatedSQL.value = '';
  } catch (err) {
    console.error('Error deleting SQL schema:', err);
    snackbarText.value = t().notifications.error;
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
}

const applyTemplate = (templateName: string) => {
  selectedTemplate.value = getSQLTemplate(templateName);
};

const applyTemplateToDatabase = () => {
  if (!selectedTemplate.value) return;

  const templateTables: Table[] = [];

  selectedTemplate.value.tables.forEach((templateTable: any) => {
    const newTable: Table = {
      id: Math.random().toString(36).substring(2, 15),
      name: templateTable.name,
      columns: [],
      foreignKeys: [],
      defaultOptions: []
    };

    templateTable.columns.forEach((col: any) => {
      const isPrimaryKey = templateTable.primaryKey === col.name;
      const constraints = [];

      if (isPrimaryKey) constraints.push('primaryKey' as never);
      if (!col.nullable) constraints.push('notNull' as never);
      if (col.unique) constraints.push('unique' as never);
      if (col.autoIncrement) constraints.push('autoIncrement' as never);

      const column: Column = {
        name: col.name,
        type: col.type,
        nullable: col.nullable,
        default: col.default || '',
        defaultType: undefined,
        primaryKey: isPrimaryKey,
        foreignKey: false,
        notNull: !col.nullable,
        unique: col.unique || false,
        autoIncrement: col.autoIncrement || false,
        referencedTable: '',
        referencedColumn: '',
        constraints: constraints
      };

      // Extraire la valeur par défaut
      const defaultMatch = col.constraints.match(/DEFAULT\s+([^,\s]+)/i);
      if (defaultMatch) {
        column.constraints?.push('default');
        const defaultValue = defaultMatch[1];

        if (defaultValue.toUpperCase() === 'NULL') {
          column.defaultType = 'NULL';
        } else if (defaultValue.toUpperCase() === 'CURRENT_TIMESTAMP') {
          column.defaultType = 'CURRENT_TIMESTAMP';
        } else {
          column.defaultType = 'custom';
          // Enlever les guillemets si présents
          column.default = defaultValue.replace(/^['"]|['"]$/g, '');
        }
      }

      newTable.columns.push(column);
    });

    if (templateTable.foreignKeys) {
      templateTable.foreignKeys.forEach((fk: any) => {
        if (fk.columns.length > 0) {
          newTable.foreignKeys.push({
            id: Math.random().toString(36).substring(2, 15),
            columnName: fk.columns[0],
            referenceTable: fk.referenceTable,
            referenceColumn: fk.referenceColumns[0],
            onDelete: fk.onDelete || 'CASCADE',
            onUpdate: fk.onUpdate || 'NO ACTION'
          });

          const columnIndex = newTable.columns.findIndex(c => c.name === fk.columns[0]);
          if (columnIndex !== -1) {
            newTable.columns[columnIndex].foreignKey = true;
            newTable.columns[columnIndex].referencedTable = fk.referenceTable;
            newTable.columns[columnIndex].referencedColumn = fk.referenceColumns[0];
            if (newTable.columns[columnIndex].constraints) {
              newTable.columns[columnIndex].constraints.push('foreignKey');
            } else {
              newTable.columns[columnIndex].constraints = ['foreignKey'];
            }
          }
        }
      });
    }

    templateTables.push(newTable);
  });

  if (!databaseName.value) {
    databaseName.value = selectedTemplate.value.name.toLowerCase().replace(/\s+/g, '_');
  }

  tables.value = templateTables;
  activeTab.value = 'config';
  generateSQL();
};

const validateColumnName = (name: string): boolean => {
  if (!name) return true;
  const emojiRegex = /[\p{Emoji}]/u;
  return !emojiRegex.test(name);
};

const handleSchemaSelection = (schemaId: number | null) => {
  if (schemaId) {
    router.push({ path: '/database-designer', query: { id: schemaId.toString() } });
  } else {
    router.push({ path: '/database-designer', query: {} });

    databaseName.value = '';
    tables.value = [];
    generatedSQL.value = '';
  }
};

const loadSchemaById = async (id: number) => {
  try {
    if (userStore.sqlSchemas.length === 0) {
      await userStore.loadSQLSchemas();
    }

    const schema = userStore.sqlSchemas.find(s => s.id === id);

    if (schema) {
      loadSelectedSchema(schema);
      snackbarText.value = t().notifications.loaded || 'Schema loaded successfully';
      snackbarColor.value = 'success';
      showSnackbar.value = true;
    } else {
      snackbarText.value = t().notifications.notFound || 'Schema not found';
      snackbarColor.value = 'error';
      showSnackbar.value = true;
    }
  } catch (err) {
    console.error('Error loading schema:', err);
    snackbarText.value = t().notifications.error;
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
};

const loadSelectedSchema = (schema: any) => {
  databaseName.value = schema.database_name;
  selectedSchemaId.value = schema.id;

  const parsedData = typeof schema.schema_data === 'string'
    ? JSON.parse(schema.schema_data)
    : schema.schema_data;

  const transformedTables: Table[] = (Array.isArray(parsedData.tables) ? parsedData.tables : []).map((table: StoredTable) => ({
    id: Math.random().toString(36).substring(2, 15),
    name: table.name || '',
    columns: (table.columns || []).map((column: any) => {
      let defaultType;
      if (column.default === 'NULL') {
        defaultType = 'NULL';
      } else if (column.default === 'CURRENT_TIMESTAMP') {
        defaultType = 'CURRENT_TIMESTAMP';
      } else if (column.default) {
        defaultType = 'custom';
      }

      return {
        name: column.name || '',
        type: column.type || 'VARCHAR(255)',
        nullable: Boolean(column.nullable),
        default: column.default || '',
        defaultType: defaultType,
        primaryKey: Boolean(column.primaryKey),
        foreignKey: Boolean(column.foreignKey),
        notNull: Boolean(column.notNull),
        unique: Boolean(column.unique),
        autoIncrement: Boolean(column.autoIncrement),
        referencedTable: '',
        referencedColumn: '',
        constraints: [
          ...(column.primaryKey ? ['primaryKey'] : []),
          ...(column.foreignKey ? ['foreignKey'] : []),
          ...(column.notNull ? ['notNull'] : []),
          ...(column.unique ? ['unique'] : []),
          ...(column.autoIncrement ? ['autoIncrement'] : []),
          ...(column.default ? ['default'] : [])
        ]
      };
    }),
    foreignKeys: []
  }));

  tables.value = transformedTables;

  generateSQL();
};

const currentDatabaseType = ref<DatabaseType>(DatabaseType.SQL);
let cytoscape: any = null;
let cytoscapeInstance: any = null;

const initCytoscape = async () => {
  // Cette fonction n'est plus utilisée, gardée pour référence
};
// Mettre à jour le diagramme lorsque les tables changent
watch(tables, () => {
  if (cytoscapeInstance) {
    cytoscapeInstance.destroy();
    cytoscapeInstance = null;
  }

  // Attendre que le DOM soit mis à jour
  setTimeout(() => {
    initCytoscape();
  }, 100);
}, { deep: true });

// Mettre à jour le diagramme lorsque l'onglet change
watch(activeTab, (newTab) => {
  if (newTab === 'diagram' && tables.value.length > 0) {
    // Attendre que le DOM soit mis à jour
    setTimeout(() => {
      initCytoscape();
    }, 100);
  }
});

onMounted(async () => {
  try {
    isLoadingSchemas.value = true;
    await loadSchemaNames();

    const schemaId = route.query.id ? parseInt(route.query.id as string, 10) : null;
    if (schemaId) {
      await loadSchemaById(schemaId);
    }

    // Initialiser le zoom par défaut
    diagramScale.value = 1.5;

  } catch (error) {
    console.error('Error in onMounted:', error);
    snackbarText.value = 'Error loading initial';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    isLoadingSchemas.value = false;
  }
});

watch(() => route.query.id, async (newId) => {
  if (newId) {
    const schemaId = parseInt(newId as string, 10);
    await loadSchemaById(schemaId);
  }
});

const exportDatabase = (format: 'json' | 'sql' | 'schema') => {
  let content = '';
  let filename = `${databaseName.value}_export`;
  let contentType = 'application/json';

  if (format === 'json') {
    const exportObj = {
      database_name: databaseName.value,
      tables: tables.value
    };
    content = JSON.stringify(exportObj, null, 2);
    filename += '.json';
  } else if (format === 'sql') {
    content = generatedSQL.value;
    filename += '.sql';
    contentType = 'text/plain';
  } else if (format === 'schema') {
    const schemaData = {
      database_name: databaseName.value,
      tables: tables.value.map(table => ({
        name: table.name,
        columns: table.columns
      }))
    };
    content = JSON.stringify(schemaData, null, 2);
    filename += '_schema.json';
  }

  const blob = new Blob([content], { type: contentType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);

  snackbarText.value = `Database exported to ${format.toUpperCase()}`;
  snackbarColor.value = 'success';
  showSnackbar.value = true;
};

const getTemplateTitle = (templateKey: string) => {
  if (templateKey === 'blog') return t().templates.blogSystem;
  if (templateKey === 'ecommerce') return t().templates.ecommerceStore;
  if (templateKey === 'project_management') return t().templates.projectManagement;

  // Fallback to the original title if no translation exists
  const template = sqlTemplateOptions.value.find(t => t.value === templateKey);
  return template ? template.title : templateKey;
};

const getTemplateDescription = (templateKey: string) => {
  switch (templateKey) {
    case 'blog':
      return t().templates.blogDescription;
    case 'ecommerce':
      return t().templates.ecommerceDescription;
    case 'project_management':
      return t().templates.projectManagementDescription;
    default:

      const template = sqlTemplateOptions.value.find(t => t.value === templateKey);
      return template ? template.description : '';
  }
};

// Import dialog and file handling
const fileInput = ref<HTMLInputElement | null>(null);
const importDialog = ref(false);
const importedFiles = ref<File[]>([]);
const importError = ref('');
const isImporting = ref(false);

// Import SQL files
const importSQLFiles = () => {
  importDialog.value = true;
  importedFiles.value = [];
  importError.value = '';
};

const selectFiles = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileImport = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    importedFiles.value = Array.from(input.files);
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

// Ajouter une variable pour suivre la progression
const importProgress = ref(0);
const totalFilesToProcess = ref(0);

const processImportedFiles = async () => {
  try {
    isImporting.value = true;
    importError.value = '';
    importProgress.value = 0;

    // Vider les tables existantes si nécessaire
    if (tables.value.length > 0) {
      const confirmClear = window.confirm(t().import.confirmClear || 'This will clear your current tables. Continue?');
      if (confirmClear) {
        tables.value = [];
      } else {
        isImporting.value = false;
        return;
      }
    }

    // Filtrer uniquement les fichiers SQL
    const sqlFiles = importedFiles.value.filter(file => file.name.toLowerCase().endsWith('.sql'));
    totalFilesToProcess.value = sqlFiles.length;

    if (sqlFiles.length === 0) {
      importError.value = 'No SQL files found in the selected folder.';
      isImporting.value = false;
      return;
    }

    // Traiter les fichiers par lots pour éviter de bloquer l'interface
    const batchSize = 5;
    let processedTables: Table[] = [];

    for (let i = 0; i < sqlFiles.length; i += batchSize) {
      const batch = sqlFiles.slice(i, i + batchSize);

      // Traiter chaque lot de fichiers en parallèle
      const batchResults = await Promise.all(batch.map(async (file) => {
        try {
          const content = await readFileContent(file);
          return parseSQLContent(content);
        } catch (e) {
          console.error(`Error processing file ${file.name}:`, e);
          return [];
        }
      }));

      // Fusionner les résultats
      batchResults.forEach(tables => {
        processedTables = [...processedTables, ...tables];
      });

      // Mettre à jour la progression
      importProgress.value = Math.min(100, Math.round(((i + batch.length) / sqlFiles.length) * 100));

      // Permettre à l'interface de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    // Ajouter les tables analysées
    tables.value = [...tables.value, ...processedTables];

    // Générer le SQL après l'importation
    generateSQL();

    // Fermer le dialogue
    importDialog.value = false;

    // Afficher un message de succès
    snackbarText.value = `${processedTables.length} tables imported successfully from ${sqlFiles.length} files`;
    snackbarColor.value = 'success';
    showSnackbar.value = true;
  } catch (error) {
    console.error('Error importing SQL files:', error);
    importError.value = error instanceof Error ? error.message : 'Unknown error during import';
  } finally {
    isImporting.value = false;
    importProgress.value = 0;
  }
};

const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file content'));
      }
    };
    reader.onerror = () => reject(new Error(`Error reading file: ${file.name}`));
    reader.readAsText(file);
  });
};

const parseSQLContent = (sqlContent: string): Table[] => {
  const tables: Table[] = [];

  // Expressions régulières pour analyser le SQL
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"']?(\w+)[`"']?\s*\(([\s\S]*?)\)[^)]*?;/gi;
  const columnRegex = /\s*[`"']?(\w+)[`"']?\s+(\w+(?:\(\d+(?:,\d+)?\))?)\s*((?:NOT\s+NULL|DEFAULT\s+[^,]+|PRIMARY\s+KEY|UNIQUE|AUTO_INCREMENT|REFERENCES\s+[^,]+)*)[,]?/gi;

  // Trouver toutes les déclarations CREATE TABLE
  let tableMatch;
  while ((tableMatch = createTableRegex.exec(sqlContent)) !== null) {
    const tableName = tableMatch[1];
    const tableContent = tableMatch[2];

    const table: Table = {
      id: Math.random().toString(36).substring(2, 15),
      name: tableName,
      columns: [],
      foreignKeys: [],
      defaultOptions: []
    };

    // Analyser les colonnes
    let columnMatch;
    while ((columnMatch = columnRegex.exec(tableContent)) !== null) {
      const columnName = columnMatch[1];
      const columnType = columnMatch[2].toUpperCase();
      const columnConstraints = columnMatch[3] || '';

      const column: Column = {
        name: columnName,
        type: columnType,
        nullable: !columnConstraints.includes('NOT NULL'),
        default: '',
        defaultType: undefined,
        primaryKey: columnConstraints.includes('PRIMARY KEY'),
        foreignKey: columnConstraints.includes('REFERENCES'),
        notNull: columnConstraints.includes('NOT NULL'),
        unique: columnConstraints.includes('UNIQUE'),
        autoIncrement: columnConstraints.includes('AUTO_INCREMENT'),
        referencedTable: '',
        referencedColumn: '',
        constraints: []
      };

      // Extraire les contraintes
      if (column.primaryKey) column.constraints?.push('primaryKey');
      if (column.notNull) column.constraints?.push('notNull');
      if (column.unique) column.constraints?.push('unique');
      if (column.autoIncrement) column.constraints?.push('autoIncrement');

      // Extraire la valeur par défaut
      const defaultMatch = columnConstraints.match(/DEFAULT\s+([^,\s]+)/i);
      if (defaultMatch) {
        column.constraints?.push('default');
        const defaultValue = defaultMatch[1];

        if (defaultValue.toUpperCase() === 'NULL') {
          column.defaultType = 'NULL';
        } else if (defaultValue.toUpperCase() === 'CURRENT_TIMESTAMP') {
          column.defaultType = 'CURRENT_TIMESTAMP';
        } else {
          column.defaultType = 'custom';
          // Enlever les guillemets si présents
          column.default = defaultValue.replace(/^['"]|['"]$/g, '');
        }
      }

      // Extraire les clés étrangères
      const foreignKeyMatch = columnConstraints.match(/REFERENCES\s+[`"']?(\w+)[`"']?\s*\(\s*[`"']?(\w+)[`"']?\s*\)/i);
      if (foreignKeyMatch) {
        column.foreignKey = true;
        column.constraints?.push('foreignKey');
        column.referencedTable = foreignKeyMatch[1];
        column.referencedColumn = foreignKeyMatch[2];
      }

      table.columns.push(column);
    }

    tables.push(table);
  }

  return tables;
};

// Variables pour le diagramme personnalisé
const diagramLayout = ref('dagre');
const layoutOptions = [
  { title: 'Hiérarchique', value: 'dagre' },
  { title: 'Concentrique', value: 'concentric' },
  { title: 'Circulaire', value: 'circle' },
  { title: 'Grille', value: 'grid' },
  { title: 'Aléatoire', value: 'random' }
];
const tablePositions = ref<Map<string, { x: number, y: number }>>(new Map());
const draggingTable = ref<{ table: any, startX: number, startY: number, offsetX: number, offsetY: number } | null>(null);
const diagramScale = ref(1.5);
const customDiagram = ref<HTMLElement | null>(null);

// Fonctions pour le diagramme personnalisé
const getTablePosition = (index: number) => {
  const table = tables.value[index];
  if (tablePositions.value.has(table.id)) {
    const position = tablePositions.value.get(table.id);
    return {
      left: `${position?.x}px`,
      top: `${position?.y}px`,
      transform: `scale(${diagramScale.value})`,
      transformOrigin: 'top left'
    };
  }
  const cols = 2; // Réduire le nombre de colonnes pour espacer les tables
  const row = Math.floor(index / cols);
  const col = index % cols;
  const x = 100 + col * 600; // Beaucoup plus d'espace horizontal
  const y = 100 + row * 450; // Beaucoup plus d'espace vertical
  tablePositions.value.set(table.id, { x, y });
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: `scale(${diagramScale.value})`,
    transformOrigin: 'top left'
  };
};

const startDrag = (event: MouseEvent, table: any) => {
  if (event.target instanceof HTMLElement) {
    const targetIsHeader = event.target.closest('.custom-table-header');
    if (!targetIsHeader) {
      return;
    }
  }

  const tablePosition = tablePositions.value.get(table.id) || { x: 0, y: 0 };
  draggingTable.value = {
    table,
    startX: event.clientX,
    startY: event.clientY,
    offsetX: tablePosition.x,
    offsetY: tablePosition.y
  };

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  event.preventDefault();
};

const onDrag = (event: MouseEvent) => {
  if (!draggingTable.value) return;

  const diagramContainer = document.querySelector('.custom-diagram-container');
  if (!diagramContainer) return;

  const containerRect = diagramContainer.getBoundingClientRect();

  const dx = event.clientX - draggingTable.value.startX;
  const dy = event.clientY - draggingTable.value.startY;

  const newX = Math.max(0, draggingTable.value.offsetX + dx);
  const newY = Math.max(0, draggingTable.value.offsetY + dy);

  tablePositions.value.set(draggingTable.value.table.id, { x: newX, y: newY });

  const padding = 50;
  if (event.clientX > containerRect.right - padding) {
    diagramContainer.scrollLeft += 10;
  } else if (event.clientX < containerRect.left + padding) {
    diagramContainer.scrollLeft -= 10;
  }

  if (event.clientY > containerRect.bottom - padding) {
    diagramContainer.scrollTop += 10;
  } else if (event.clientY < containerRect.top + padding) {
    diagramContainer.scrollTop -= 10;
  }
};

const stopDrag = () => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  draggingTable.value = null;
};

const getRelationCoords = (table: any, column: any) => {
  const result = { x1: 0, y1: 0, x2: 0, y2: 0 };

  if (!column.referencedTable) return result;

  const sourceTable = table;
  const targetTable = tables.value.find(t => t.name === column.referencedTable);

  if (!sourceTable || !targetTable) return result;

  const sourcePosition = tablePositions.value.get(sourceTable.id) || { x: 0, y: 0 };
  const targetPosition = tablePositions.value.get(targetTable.id) || { x: 0, y: 0 };

  // Position de départ (côté droit de la table source)
  result.x1 = sourcePosition.x + 350;
  result.y1 = sourcePosition.y + 60;

  // Position d'arrivée (côté gauche de la table cible)
  result.x2 = targetPosition.x;
  result.y2 = targetPosition.y + 60;

  return result;
};

const getRelationLabelPosition = (table: any, column: any) => {
  const coords = getRelationCoords(table, column);
  return {
    x: coords.x1 + (coords.x2 - coords.x1) / 2,
    y: coords.y1 + (coords.y2 - coords.y1) / 2
  };
};

const rearrangeTables = () => {
  const centerX = 1000;
  const centerY = 750;
  const radius = tables.value.length <= 4 ? 450 : 600;

  tables.value.forEach((table, index) => {
    const angle = (index / tables.value.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    tablePositions.value.set(table.id, { x, y });
  });

  snackbarText.value = t().notifications.rearranged || "Tables réorganisées";
  snackbarColor.value = "success";
  showSnackbar.value = true;
};

const zoomIn = () => {
  diagramScale.value = Math.min(2.5, diagramScale.value + 0.2);
};

const zoomOut = () => {
  diagramScale.value = Math.max(0.5, diagramScale.value - 0.2);
};

const resetZoom = () => {
  diagramScale.value = 1.5;
};

const focusTable = (table: any) => {
  const position = tablePositions.value.get(table.id);
  if (!position || !customDiagram.value) return;

  const container = document.querySelector('.custom-diagram-container');
  if (container) {
    container.scrollTo({
      left: position.x - 100,
      top: position.y - 100,
      behavior: 'smooth'
    });
  }
};

const exportDiagramImage = () => {
  try {
    const container = document.getElementById('custom-diagram');
    if (!container) return;

    // Utiliser html2canvas (à installer)
    snackbarText.value = "Fonctionnalité d'export à implémenter";
    snackbarColor.value = "info";
    showSnackbar.value = true;
  } catch (error) {
    console.error('Error exporting diagram:', error);
  }
};

const changeLayout = (layout: string) => {
  diagramLayout.value = layout;
  rearrangeTables();
};
</script>

<style>
.min-width-150 {
  min-width: 150px;
}

.transition-all {
  transition: all 0.2s ease;
}

.hover-elevate-1:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.hover-border-primary:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
}

.table-fixed {
  table-layout: fixed;
}

.table-fixed th,
.table-fixed td {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .min-width-150 {
    min-width: 100%;
  }
}

.er-diagram-container {
  width: 100%;
  height: 600px;
  overflow: auto;
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f8f8f8;
}

.er-diagram {
  position: relative;
  width: 2000px;
  height: 1500px;
}

.er-table {
  position: absolute;
  width: 220px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: move;
  user-select: none;
  z-index: 2;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.er-table:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.er-table-header {
  background-color: #1976d2;
  color: white;
  padding: 8px 12px;
  font-weight: bold;
  font-size: 14px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.er-table-content {
  padding: 8px 0;
  max-height: 250px;
  overflow-y: auto;
}

.er-column {
  padding: 4px 12px;
  display: flex;
  align-items: center;
  font-size: 13px;
  border-bottom: 1px solid #f0f0f0;
}

.er-column:last-child {
  border-bottom: none;
}

.er-column.primary-key {
  background-color: rgba(255, 193, 7, 0.1);
}

.er-column.foreign-key {
  background-color: rgba(33, 150, 243, 0.1);
}

.er-column-icon {
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.er-column-name {
  flex: 1;
  font-weight: 500;
}

.er-column-type {
  color: #757575;
  font-size: 11px;
  margin-left: 4px;
}

.er-relations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* Styles pour Cytoscape */
.cy-diagram {
  width: 100%;
  height: 600px;
  background-color: #fafafa;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.max-width-200 {
  max-width: 200px;
}

.tooltip-table {
  border-collapse: collapse;
  width: 100%;
}

.tooltip-table th,
.tooltip-table td {
  border-bottom: 1px solid #eee;
  padding: 4px;
  text-align: left;
}

/* Styles pour le diagramme personnalisé */
.custom-diagram-container {
  width: 100%;
  height: 700px;
  overflow: auto;
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.custom-diagram {
  position: relative;
  width: 3000px;
  height: 2000px;
}

.custom-table {
  position: absolute;
  width: 350px;
  /* Plus large */
  background-color: white;
  border-radius: 12px;
  /* Plus arrondi */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  /* Ombre plus prononcée */
  user-select: none;
  z-index: 2;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  transform-origin: center;
}

.custom-table:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.custom-table-header {
  background: linear-gradient(135deg, #1976d2, #2196F3);
  color: white;
  padding: 20px;
  /* Plus de padding */
  font-weight: bold;
  font-size: 18px;
  /* Police plus grande */
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
}

.custom-table-title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.custom-table-actions {
  display: flex;
  align-items: center;
}

.custom-table-content {
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
}

.custom-column {
  padding: 15px 20px;
  /* Plus de padding */
  display: flex;
  align-items: center;
  font-size: 16px;
  /* Police plus grande */
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.custom-column:hover {
  background-color: #f5f5f5;
}

.custom-column:last-child {
  border-bottom: none;
}

.custom-column.primary-key {
  background-color: rgba(255, 193, 7, 0.1);
}

.custom-column.primary-key:hover {
  background-color: rgba(255, 193, 7, 0.2);
}

.custom-column.foreign-key {
  background-color: rgba(33, 150, 243, 0.1);
}

.custom-column.foreign-key:hover {
  background-color: rgba(33, 150, 243, 0.2);
}

.custom-column-icon {
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.custom-column-name {
  flex: 1;
  font-weight: 500;
}

.custom-column-type {
  color: #757575;
  font-size: 12px;
  padding: 2px 6px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-left: 8px;
}

.custom-relations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.custom-relations text {
  pointer-events: none;
  font-family: 'Roboto', sans-serif;
  background: white;
  padding: 2px;
}

.custom-relations line {
  stroke-dasharray: 5, 5;
  animation: dash 30s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: 1000;
  }
}
</style>
