<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-6">

        <v-tabs v-model="activeTab" color="primary" align-tabs="center">
          <v-tab value="config" class="text-subtitle-1">
            <v-icon start>mdi-cog</v-icon>
            Configuration
          </v-tab>
          <v-tab value="templates" class="text-subtitle-1">
            <v-icon start>mdi-file-document-multiple</v-icon>
            Templates
          </v-tab>
          <v-tab value="diagram" class="text-subtitle-1">
            <v-icon start>mdi-chart-bubble</v-icon>
            Diagram
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
                        Database Settings
                      </div>
                      <v-divider class="mb-4"></v-divider>

                      <v-text-field v-model="databaseName" label="Database name" variant="outlined"
                        prepend-inner-icon="mdi-database-edit" placeholder="my_database" class="mb-4"
                        hide-details></v-text-field>

                      <v-select v-model="selectedSchemaId" :items="availableSchemas" item-title="title"
                        item-value="value" label="Load existing schema" variant="outlined" class="mb-4"
                        prepend-inner-icon="mdi-folder-open" @update:model-value="handleSchemaSelection" hide-details
                        :loading="isLoadingSchemas"></v-select>

                      <div class="d-flex flex-wrap">
                        <v-btn color="primary" @click="addTable" prepend-icon="mdi-table-plus" variant="tonal"
                          class="mr-2 mb-2">
                          Add table
                        </v-btn>
                        <v-btn color="success" @click="saveSQLSchema" prepend-icon="mdi-content-save" variant="tonal"
                          class="mr-2 mb-2">
                          Save
                        </v-btn>
                        <v-menu>
                          <template v-slot:activator="{ props }">
                            <v-btn color="info" prepend-icon="mdi-export" variant="tonal" class="mr-2 mb-2"
                              v-bind="props">
                              Export
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item @click="exportDatabase('json')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-code-json</v-icon>
                                JSON
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="exportDatabase('sql')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-database</v-icon>
                                SQL
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="exportDatabase('schema')">
                              <v-list-item-title class="d-flex align-center">
                                <v-icon class="mr-2">mdi-file-document</v-icon>
                                Schéma
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                        <v-btn color="error" @click="deleteSQLSchema" prepend-icon="mdi-delete" variant="tonal"
                          class="mb-2">
                          Delete
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>

                  <v-card v-if="generatedSQL" class="rounded-lg" elevation="2">
                    <v-card-title
                      class="d-flex justify-space-between align-center bg-primary text-white py-3 px-4 rounded-t-lg">
                      <div class="d-flex align-center">
                        <v-icon color="white" class="mr-2">mdi-code-braces</v-icon>
                        Generated SQL
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
                        Regenerate SQL
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col cols="12" lg="7">
                  <v-card class="rounded-lg" elevation="2">
                    <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                      <v-icon color="white" class="mr-2">mdi-table-multiple</v-icon>
                      Database tables
                      <v-spacer></v-spacer>
                      <v-btn v-if="!generatedSQL" color="white" variant="text" @click="generateSQL"
                        prepend-icon="mdi-play">
                        Generate SQL
                      </v-btn>
                    </v-card-title>

                    <v-card-text class="pa-4">
                      <div v-if="tables.length === 0" class="text-center pa-8">
                        <v-icon size="64" color="grey-lighten-1">mdi-table-plus</v-icon>
                        <div class="text-h6 mt-4 text-grey">No tables defined</div>
                        <div class="text-body-1 text-grey-darken-1 mb-4">Start by adding a table to your database</div>
                        <v-btn color="primary" variant="tonal" @click="addTable" prepend-icon="mdi-table-plus">
                          Add table
                        </v-btn>
                      </div>

                      <v-expansion-panels v-else variant="accordion" multiple>
                        <v-expansion-panel v-for="(table, index) in tables" :key="index"
                          class="mb-4 rounded-lg border border-grey-lighten-2 hover-border-primary transition-all"
                          :title="table.name || 'Unnamed table'">
                          <template v-slot:title>
                            <div class="d-flex align-center">
                              <v-icon color="primary" class="mr-2">mdi-table</v-icon>
                              <span class="text-subtitle-1">{{ table.name || 'Unnamed table' }}</span>
                              <v-chip class="ml-2" size="small" color="grey-lighten-3">
                                {{ table.columns.length }} column{{ table.columns.length !== 1 ? 's' : '' }}
                              </v-chip>
                            </div>
                          </template>

                          <v-expansion-panel-text>
                            <v-text-field v-model="table.name" label="Table name" variant="outlined"
                              prepend-inner-icon="mdi-table-edit" placeholder="users, products, orders..."
                              class="mb-4"></v-text-field>

                            <div class="d-flex justify-space-between align-center mb-3">
                              <div class="text-subtitle-1 font-weight-bold d-flex align-center">
                                <v-icon color="primary" class="mr-2">mdi-table-column</v-icon>
                                Columns
                              </div>
                              <v-btn color="primary" size="small" variant="tonal" @click="addColumn(table)"
                                prepend-icon="mdi-plus">
                                Add column
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
                                Delete this table
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
                      Database Templates
                    </v-card-title>
                    <v-card-text class="py-4">
                      <p class="text-body-2 mb-4">Choose a pre-defined database schema template to quickly get started.
                      </p>
                      <v-list lines="two">
                        <v-list-item v-for="template in sqlTemplateOptions" :key="template.value"
                          @click="applyTemplate(template.value)" class="mb-2" rounded elevation="1">
                          <template v-slot:prepend>
                            <v-avatar color="primary" variant="tonal">
                              <v-icon>mdi-database-outline</v-icon>
                            </v-avatar>
                          </template>
                          <v-list-item-title>{{ template.title }}</v-list-item-title>
                          <v-list-item-subtitle>{{ template.description }}</v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="8" lg="9">
                  <v-card class="rounded-lg" elevation="2">
                    <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                      <v-icon color="white" class="mr-2">mdi-file-eye</v-icon>
                      Template Preview
                    </v-card-title>
                    <v-card-text class="pa-4">
                      <div v-if="!selectedTemplate" class="text-center pa-8">
                        <v-icon size="64" color="grey-lighten-1">mdi-database-search</v-icon>
                        <div class="text-h6 mt-4 text-grey">No template selected</div>
                        <div class="text-body-1 text-grey-darken-1 mb-4">Select a template from the list to preview its
                          tables and
                          structure</div>
                      </div>

                      <div v-else>
                        <div class="d-flex align-center mb-4">
                          <v-chip color="primary" variant="tonal" class="mr-2">{{ selectedTemplate.name }}</v-chip>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" @click="applyTemplateToDatabase" prepend-icon="mdi-check"
                            variant="tonal">
                            Use this template
                          </v-btn>
                        </div>

                        <v-alert color="info" variant="tonal" class="mb-4">
                          <div class="text-body-2">{{ selectedTemplate.description }}</div>
                        </v-alert>

                        <div class="text-h6 mb-2 d-flex align-center">
                          <v-icon color="primary" class="mr-2">mdi-table-multiple</v-icon>
                          Tables Structure
                        </div>

                        <v-expansion-panels variant="accordion" class="mb-4">
                          <v-expansion-panel v-for="table in selectedTemplate.tables" :key="table.name"
                            class="mb-2 rounded-lg border border-grey-lighten-2">
                            <v-expansion-panel-title>
                              <div class="d-flex align-center">
                                <v-icon color="primary" class="mr-2">mdi-table</v-icon>
                                <strong>{{ table.name }}</strong>
                                <v-chip size="small" color="grey" variant="tonal" class="ml-3">
                                  {{ table.columns.length }} columns
                                </v-chip>
                              </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              <v-table density="compact" class="table-fixed">
                                <thead>
                                  <tr>
                                    <th>Column</th>
                                    <th>Type</th>
                                    <th>Nullable</th>
                                    <th>Default</th>
                                    <th>Other</th>
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
                                          UNIQUE
                                        </v-chip>
                                        <v-chip v-if="column.autoIncrement" size="x-small" color="success"
                                          variant="tonal" class="mr-1 mb-1">
                                          AUTO INC
                                        </v-chip>
                                        <v-chip v-if="column.primaryKey" size="x-small" color="warning" variant="tonal"
                                          class="mr-1 mb-1">
                                          PRIMARY
                                        </v-chip>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </v-table>

                              <div v-if="table.foreignKeys && table.foreignKeys.length > 0" class="mt-4">
                                <div class="text-subtitle-2 mb-2">Foreign Keys:</div>
                                <v-chip v-for="(fk, i) in table.foreignKeys" :key="i" color="secondary" variant="tonal"
                                  class="mr-2 mb-2">
                                  {{ fk.columns.join(', ') }} → {{ fk.referenceTable }}.{{ fk.referenceColumns.join(',')
                                  }}
                                </v-chip>
                              </div>

                              <div v-if="table.indices && table.indices.length > 0" class="mt-3">
                                <div class="text-subtitle-2 mb-2">Indices:</div>
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
                            Using this template will replace your current database schema. Make sure to save your work
                            before
                            applying a template.
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
                      Relations Diagram
                    </v-card-title>
                    <v-card-text class="pa-4">
                      <div v-if="tables.length === 0" class="text-center pa-8">
                        <v-icon size="64" color="grey-lighten-1">mdi-table-plus</v-icon>
                        <div class="text-h6 mt-4 text-grey">No table defined</div>
                        <div class="text-body-1 text-grey-darken-1 mb-4">Start by adding at least one table</div>
                        <v-btn color="primary" variant="tonal" @click="addTable" prepend-icon="mdi-table-plus">
                          Add a table
                        </v-btn>
                      </div>
                      <div v-else class="er-diagram-container">
                        <div id="er-diagram" class="er-diagram">
                          <div v-for="(table, tableIndex) in tables" :key="table.id" class="er-table"
                            :style="getTablePosition(tableIndex)" @mousedown="startDrag($event, table)"
                            :id="`table-${table.id}`">
                            <div class="er-table-header">{{ table.name || 'No name' }}</div>
                            <div class="er-table-content">
                              <div v-for="column in table.columns" :key="column.name" class="er-column" :class="{
                                'primary-key': column.primaryKey,
                                'foreign-key': column.foreignKey
                              }">
                                <span class="er-column-icon">
                                  <v-icon v-if="column.primaryKey" size="x-small"
                                    color="amber-darken-2">mdi-key</v-icon>
                                  <v-icon v-else-if="column.foreignKey" size="x-small"
                                    color="blue-darken-1">mdi-link-variant</v-icon>
                                  <v-icon v-else size="x-small" color="grey">mdi-circle-small</v-icon>
                                </span>
                                <span class="er-column-name">{{ column.name }}</span>
                                <span class="er-column-type">{{ column.type }}</span>
                              </div>
                            </div>
                          </div>
                          <!-- Relations entre tables -->
                          <svg class="er-relations">
                            <g v-for="(table, tableIndex) in tables" :key="`rel-${table.id}`">
                              <template v-for="column in table.columns" :key="`rel-${table.id}-${column.name}`">
                                <line v-if="column.foreignKey && column.referencedTable"
                                  :x1="getRelationCoords(table, column).x1" :y1="getRelationCoords(table, column).y1"
                                  :x2="getRelationCoords(table, column).x2" :y2="getRelationCoords(table, column).y2"
                                  stroke="#2196F3" stroke-width="2" marker-end="url(#arrowhead)" />
                              </template>
                            </g>
                            <defs>
                              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5"
                                orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#2196F3" />
                              </marker>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </v-card-text>
                    <v-card-actions class="pa-4 pt-0">
                      <v-spacer></v-spacer>
                      <v-btn color="primary" variant="tonal" @click="autoArrangeTables">
                        <v-icon start>mdi-arrange-send-backward</v-icon>
                        Rearrange
                      </v-btn>
                      <v-btn disabled color="success" variant="tonal" @click="exportDiagram">
                        <v-icon start>mdi-export</v-icon>
                        Export
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-row>
      </v-container>
    </v-main>

    <snackBar v-model="showSnackbar" :text="snackbarText" :color="snackbarColor" :timeout="3000" />
  </v-app>
</template>

<script lang="ts" setup>
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/atom-one-dark.css';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import snackBar from '../components/snackBar.vue';
import { useUserStore } from '../stores/userStore';
import { getSQLTemplate, getSQLTemplateNames } from '../utils/sqlTemplates';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import javascript from 'highlight.js/lib/languages/javascript';
import sql from 'highlight.js/lib/languages/sql';
import { DatabaseType, SQLSchema, StoredTable, Table, Column } from '../utils/sql/types';

useHead({
  title: 'SQL Designer - StackUnity',
  meta: [
    { name: 'description', content: 'Visual database design tool for SQL' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'SQL Designer - StackUnity' },
    { name: 'og:description', content: 'Visual database design tool for SQL' },
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
    let message = 'SQL copié dans le presse-papiers';

    if (currentDatabaseType.value === DatabaseType.NOSQL) {
      message = 'Code NoSQL copié dans le presse-papiers';
    } else if (currentDatabaseType.value === DatabaseType.ORM) {
      message = 'Code ORM copié dans le presse-papiers';
    }

    snackbarText.value = message;
    snackbarColor.value = 'success';
    showSnackbar.value = true;
  } catch (err) {
    console.error('Failed to copy code:', err);
    snackbarText.value = 'Error copying code';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
};

const saveSQLSchema = async () => {
  if (!databaseName.value.trim()) {
    snackbarText.value = 'Database name is required';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    return;
  }

  if (!tables.value.length) {
    snackbarText.value = 'Add at least one table';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    return;
  }

  const invalidTables = tables.value.filter(t => !t.name.trim() || !t.columns.length);
  if (invalidTables.length) {
    snackbarText.value = 'All tables must have a name and at least one column';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    return;
  }

  const hasInvalidColumns = tables.value.some(t =>
    t.columns.some(c => !c.name.trim() || (c.name && !validateColumnName(c.name)))
  );
  if (hasInvalidColumns) {
    snackbarText.value = 'All columns must have a valid name without emoji';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    return;
  }

  try {
    await userStore.saveSQLSchema(databaseName.value, tables.value as any);
    snackbarText.value = 'SQL schema saved successfully';
    snackbarColor.value = 'success';
    showSnackbar.value = true;
    await userStore.loadSQLSchemas();
  } catch (err) {
    console.error('Error saving SQL schema:', err);
    snackbarText.value = 'Error saving schema';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
}

const deleteSQLSchema = async () => {
  if (!selectedSchemaId.value) {
    snackbarText.value = 'Select a schema to delete';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    return;
  }

  try {
    await userStore.deleteSQLSchema(selectedSchemaId.value);
    await userStore.loadSQLSchemas();
    snackbarText.value = 'SQL schema deleted successfully';
    snackbarColor.value = 'success';
    showSnackbar.value = true;

    databaseName.value = '';
    tables.value = [];
    selectedSchemaId.value = null;
    generatedSQL.value = '';
  } catch (err) {
    console.error('Error deleting SQL schema:', err);
    snackbarText.value = 'Error deleting schema';
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

      newTable.columns.push({
        name: col.name,
        type: col.type,
        nullable: col.nullable,
        default: col.default || '',
        primaryKey: isPrimaryKey,
        autoIncrement: col.autoIncrement || false,
        unique: col.unique || false,
        foreignKey: false,
        notNull: !col.nullable,
        constraints: constraints
      });
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
      snackbarText.value = 'Schema loaded successfully';
      snackbarColor.value = 'success';
      showSnackbar.value = true;
    } else {
      snackbarText.value = 'Schema not found';
      snackbarColor.value = 'error';
      showSnackbar.value = true;
    }
  } catch (err) {
    console.error('Error loading schema:', err);
    snackbarText.value = 'Error loading schema';
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
        referencedTable: column.referencedTable || '',
        referencedColumn: column.referencedColumn || '',
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

const tablePositions = ref<Map<string, { x: number, y: number }>>(new Map());
const draggingTable = ref<{ table: any, startX: number, startY: number, offsetX: number, offsetY: number } | null>(null);

const getTablePosition = (index: number) => {
  const table = tables.value[index];
  if (tablePositions.value.has(table.id)) {
    const position = tablePositions.value.get(table.id);
    return {
      left: `${position?.x}px`,
      top: `${position?.y}px`
    };
  }
  const cols = 4;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const x = 50 + col * 250;
  const y = 50 + row * 300;
  tablePositions.value.set(table.id, { x, y });
  return { left: `${x}px`, top: `${y}px` };
};

const startDrag = (event: MouseEvent, table: any) => {
  if (event.target instanceof HTMLElement) {
    const targetIsHeader = event.target.closest('.er-table-header');
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

  const diagramContainer = document.querySelector('.er-diagram-container');
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

  result.x1 = sourcePosition.x + 220;
  result.y1 = sourcePosition.y + 50;

  result.x2 = targetPosition.x;
  result.y2 = targetPosition.y + 50;

  return result;
};

const autoArrangeTables = () => {
  const centerX = 1000;
  const centerY = 750;
  const radius = tables.value.length <= 4 ? 250 : 400;

  tables.value.forEach((table, index) => {
    const angle = (index / tables.value.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    tablePositions.value.set(table.id, { x, y });
  });

  snackbarText.value = "Tables rearranged";
  snackbarColor.value = "success";
  showSnackbar.value = true;
};

const exportDiagram = async (format: 'png' | 'svg') => {
  try {

  } catch (error) {
    console.error(`Error exporting ${format}:`, error);
  }
};

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

hljs.registerLanguage('sql', sql);
hljs.registerLanguage('javascript', javascript);

onMounted(async () => {
  try {
    isLoadingSchemas.value = true;
    await loadSchemaNames();

    const schemaId = route.query.id ? parseInt(route.query.id as string, 10) : null;
    if (schemaId) {
      await loadSchemaById(schemaId);
    }
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
</style>
