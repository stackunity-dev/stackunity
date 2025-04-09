import { ConversionOptions, SQLColumn, SQLSchema, SQLTable } from './types';

/**
 * Convertit un schéma SQL en code ORM (Sequelize/TypeORM/Prisma/Mongoose)
 */
export function convertToORM(schema: SQLSchema, options: ConversionOptions = {}): string {
  const { ormType = 'sequelize' } = options;

  switch (ormType) {
    case 'sequelize':
      return convertToSequelize(schema, options);
    case 'typeorm':
      return convertToTypeORM(schema, options);
    case 'prisma':
      return convertToPrisma(schema, options);
    case 'mongoose':
      return convertToMongoose(schema, options);
    default:
      return convertToSequelize(schema, options);
  }
}

/**
 * Convertit un schéma SQL en modèles Sequelize
 */
function convertToSequelize(schema: SQLSchema, options: ConversionOptions = {}): string {
  let result = `const { Sequelize, DataTypes } = require('sequelize');\n\n`;
  result += `const sequelize = new Sequelize('${schema.database_name}', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql', // or 'postgres', 'sqlite', 'mssql'
});\n\n`;

  // Define models
  const modelDefinitions: string[] = [];
  const associations: string[] = [];

  schema.tables.forEach(table => {
    const modelName = capitalizeFirstLetter(table.name);

    // Model definition
    let modelDef = `const ${modelName} = sequelize.define('${table.name}', {\n`;

    // Columns definition
    table.columns.forEach(column => {
      modelDef += `  ${column.name}: {\n`;
      modelDef += `    type: ${getSequelizeType(column)},\n`;

      // Add constraints
      if (column.constraints) {
        if (column.name.toLowerCase() === 'id' && column.constraints.includes('primary')) {
          modelDef += `    primaryKey: true,\n`;
        }

        if (column.constraints.includes('primary')) {
          modelDef += `    primaryKey: true,\n`;
        }

        if (column.autoIncrement || (column.name.toLowerCase() === 'id' && column.type.includes('INT'))) {
          modelDef += `    autoIncrement: true,\n`;
        }

        if (column.unique || column.constraints.includes('unique')) {
          modelDef += `    unique: true,\n`;
        }

        if (!column.nullable) {
          modelDef += `    allowNull: false,\n`;
        }

        if (column.default !== undefined) {
          if (column.default === 'CURRENT_TIMESTAMP') {
            modelDef += `    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),\n`;
          } else if (column.default === 'NULL') {
            modelDef += `    defaultValue: null,\n`;
          } else {
            modelDef += `    defaultValue: ${column.default},\n`;
          }
        }
      }

      modelDef += `  },\n`;
    });

    // Model options
    modelDef += `}, {\n`;
    modelDef += `  tableName: '${table.name}',\n`;
    modelDef += `  timestamps: ${options.includeTimestamps ? 'true' : 'false'},\n`;

    if (options.includeTimestamps) {
      modelDef += `  createdAt: 'created_at',\n`;
      modelDef += `  updatedAt: 'updated_at',\n`;
    }

    modelDef += `});\n\n`;

    modelDefinitions.push(modelDef);

    // Create associations
    const tableForeignKeys = table.columns.filter(column => column.foreignKey);

    tableForeignKeys.forEach(column => {
      if (column.referencedTable) {
        const targetModel = capitalizeFirstLetter(column.referencedTable);
        associations.push(`${modelName}.belongsTo(${targetModel}, {
  foreignKey: '${column.name}',
  as: '${column.referencedTable}'
});
${targetModel}.hasMany(${modelName}, {
  foreignKey: '${column.name}',
  as: '${table.name}'
});\n`);
      }
    });
  });

  // Add model definitions and associations
  result += modelDefinitions.join('');

  if (associations.length > 0) {
    result += associations.join('\n');
  }

  // Add exports
  result += `\nmodule.exports = {\n`;
  schema.tables.forEach(table => {
    const modelName = capitalizeFirstLetter(table.name);
    result += `  ${modelName},\n`;
  });

  result += `  sequelize\n};\n`;

  return result;
}

/**
 * Convertit un schéma SQL en entités TypeORM
 */
function convertToTypeORM(schema: SQLSchema, options: ConversionOptions = {}): string {
  let result = `import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';\n\n`;

  // Generate entities
  const entities: string[] = [];

  schema.tables.forEach(table => {
    const entityName = capitalizeFirstLetter(singularize(table.name));

    let entityCode = `@Entity({ name: '${table.name}' })\n`;
    entityCode += `export class ${entityName} {\n`;

    // Columns
    table.columns.forEach(column => {
      // Primary key with auto-increment
      if (
        (column.name.toLowerCase() === 'id' && column.constraints?.includes('primary')) ||
        column.autoIncrement
      ) {
        entityCode += `  @PrimaryGeneratedColumn()\n`;
      }
      // Primary key without auto-increment
      else if (column.constraints?.includes('primary')) {
        entityCode += `  @PrimaryColumn(${getTypeORMColumnType(column)})\n`;
      }
      // Foreign keys
      else if (column.foreignKey && column.referencedTable) {
        const refEntityName = capitalizeFirstLetter(singularize(column.referencedTable));

        entityCode += `  @Column(${getTypeORMColumnType(column)})\n`;
        entityCode += `  ${column.name}: ${getTypeORMPropertyType(column)};\n\n`;

        // Add relationship
        entityCode += `  @ManyToOne(() => ${refEntityName}, ${refEntityName.toLowerCase()} => ${refEntityName.toLowerCase()}.${pluralize(table.name)})\n`;
        entityCode += `  @JoinColumn({ name: '${column.name}' })\n`;
        entityCode += `  ${column.referencedTable.toLowerCase()}: ${refEntityName};\n\n`;

        // Skip the regular column definition below
        return;
      }
      // Regular column
      else {
        const columnOptions = getTypeORMColumnOptions(column);
        entityCode += `  @Column(${columnOptions})\n`;
      }

      // Property definition
      entityCode += `  ${column.name}: ${getTypeORMPropertyType(column)};\n\n`;
    });

    // Add timestamps if requested
    if (options.includeTimestamps) {
      entityCode += `  @CreateDateColumn({ name: 'created_at' })\n`;
      entityCode += `  createdAt: Date;\n\n`;

      entityCode += `  @UpdateDateColumn({ name: 'updated_at' })\n`;
      entityCode += `  updatedAt: Date;\n\n`;
    }

    // Add inverse relationships for tables that reference this one
    const relatedTables = findTablesWithReference(schema.tables, table.name);
    if (relatedTables.length > 0) {
      relatedTables.forEach(rel => {
        const relEntityName = capitalizeFirstLetter(singularize(rel.table.name));
        entityCode += `  @OneToMany(() => ${relEntityName}, ${relEntityName.toLowerCase()} => ${relEntityName.toLowerCase()}.${table.name.toLowerCase()})\n`;
        entityCode += `  ${pluralize(rel.table.name)}: ${relEntityName}[];\n\n`;
      });
    }

    // Close the class
    entityCode += `}\n\n`;

    entities.push(entityCode);
  });

  result += entities.join('');

  // Add sample data source configuration
  result += `import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql', // or 'postgres', 'sqlite', etc.
  host: 'localhost',
  port: 3306,
  username: 'user',
  password: 'password',
  database: '${schema.database_name}',
  synchronize: false, // Set to false in production
  logging: true,
  entities: [${schema.tables.map(t => capitalizeFirstLetter(singularize(t.name))).join(', ')}],
  migrations: ['src/migration/**/*.ts'],
  subscribers: [],
});\n`;

  return result;
}

/**
 * Convertit un schéma SQL en schéma Prisma
 */
function convertToPrisma(schema: SQLSchema, options: ConversionOptions = {}): string {
  let result = `datasource db {\n`;
  result += `  provider = "mysql"\n`;
  result += `  url      = env("DATABASE_URL")\n`;
  result += `}\n\n`;

  // Add generator
  result += `generator client {\n`;
  result += `  provider = "prisma-client-js"\n`;
  result += `}\n\n`;

  // Generate models
  schema.tables.forEach(table => {
    const modelName = capitalizeFirstLetter(singularize(table.name));

    result += `model ${modelName} {\n`;

    // Columns
    table.columns.forEach(column => {
      const fieldName = column.name;
      const fieldType = getPrismaFieldType(column);
      const attributes: string[] = [];

      // Handle primary key
      if (
        (column.name.toLowerCase() === 'id' &&
          (column.constraints?.includes('primary') || column.type.toLowerCase().includes('int'))) ||
        column.constraints?.includes('primary')
      ) {
        attributes.push('@id');
      }

      // Auto-increment
      if (column.autoIncrement ||
        (column.name.toLowerCase() === 'id' && column.type.toLowerCase().includes('int'))) {
        attributes.push('@default(autoincrement())');
      }

      // Unique constraint
      if (column.unique && !column.constraints?.includes('primary')) {
        attributes.push('@unique');
      }

      // Default values
      if (column.default) {
        if (column.default === 'CURRENT_TIMESTAMP') {
          attributes.push('@default(now())');
        } else if (column.default === 'NULL') {
          // Prisma doesn't need explicit NULL defaults
        } else if (column.default.startsWith('"') && column.default.endsWith('"')) {
          // String default value
          attributes.push(`@default(${column.default.replace(/"/g, '"')})`);
        } else {
          attributes.push(`@default(${column.default})`);
        }
      }

      // Map to the original column name if different
      // (Prisma uses camelCase for fields by default)
      attributes.push(`@map("${column.name}")`);

      result += `  ${fieldName} ${fieldType}${!column.nullable ? '' : '?'} ${attributes.join(' ')}\n`;
    });

    // Relations
    table.columns.forEach(column => {
      if (column.foreignKey && column.referencedTable) {
        const relatedModelName = capitalizeFirstLetter(singularize(column.referencedTable));
        const fieldName = column.referencedTable.toLowerCase();

        result += `  ${fieldName} ${relatedModelName} @relation(fields: [${column.name}], references: [${column.referencedColumn || 'id'}])\n`;
      }
    });

    // Inverse relations (for tables that reference this one)
    const relatedTables = findTablesWithReference(schema.tables, table.name);
    if (relatedTables.length > 0) {
      relatedTables.forEach(rel => {
        const relModelName = capitalizeFirstLetter(singularize(rel.table.name));
        const fieldName = pluralize(rel.table.name).toLowerCase();

        result += `  ${fieldName} ${relModelName}[] @relation("${relModelName}To${modelName}")\n`;
      });
    }

    // Add custom timestamps if they don't exist already
    if (options.includeTimestamps) {
      if (!table.columns.some(c => c.name === 'created_at')) {
        result += `  createdAt DateTime @default(now()) @map("created_at")\n`;
      }

      if (!table.columns.some(c => c.name === 'updated_at')) {
        result += `  updatedAt DateTime @updatedAt @map("updated_at")\n`;
      }
    }

    result += `  @@map("${table.name}")\n`;
    result += `}\n\n`;
  });

  return result;
}

/**
 * Convertit un schéma SQL en modèles Mongoose
 */
function convertToMongoose(schema: SQLSchema, options: ConversionOptions = {}): string {
  let result = `const mongoose = require('mongoose');\n`;
  result += `const { Schema } = mongoose;\n\n`;

  // Create mongoose schemas
  const modelDefinitions: string[] = [];
  const schemaDefinitions: string[] = [];

  schema.tables.forEach(table => {
    const tableName = table.name;
    const modelName = capitalizeFirstLetter(singularize(tableName));

    let schemaDefinition = `const ${modelName}Schema = new Schema({\n`;

    // Process columns
    const fields: string[] = [];
    const references: string[] = [];

    table.columns.forEach(column => {
      // Skip id columns (MongoDB has _id by default)
      if (column.name.toLowerCase() === 'id' && column.type.includes('INT')) {
        return;
      }

      // Handle foreign keys as references
      if (column.foreignKey && column.referencedTable) {
        const refModelName = capitalizeFirstLetter(singularize(column.referencedTable));
        references.push(`  ${column.name}: { type: Schema.Types.ObjectId, ref: '${refModelName}' }`);
      } else {
        fields.push(getMongooseFieldDefinition(column));
      }
    });

    schemaDefinition += [...fields, ...references].join(',\n');
    schemaDefinition += `\n}, { timestamps: ${options.includeTimestamps ? 'true' : 'false'} });\n\n`;

    // Add the model definition
    schemaDefinition += `const ${modelName} = mongoose.model('${modelName}', ${modelName}Schema);\n`;

    schemaDefinitions.push(schemaDefinition);
    modelDefinitions.push(`module.exports.${modelName} = ${modelName};`);
  });

  // Create relationships and helper methods
  schema.tables.forEach(table => {
    // Find tables that reference this table through foreign keys
    const relatedTables = findTablesWithReference(schema.tables, table.name);

    if (relatedTables.length > 0) {
      const modelName = capitalizeFirstLetter(singularize(table.name));
      let additionalMethods = `\n${modelName}Schema.methods = {\n`;

      relatedTables.forEach(rel => {
        const relModelName = capitalizeFirstLetter(singularize(rel.table.name));
        additionalMethods += `  get${relModelName}s: async function() {
    return await mongoose.model('${relModelName}').find({ ${rel.column.name}: this._id });
  },\n`;
      });

      additionalMethods += `};\n`;

      // Find the schema definition to update
      const schemaIndex = schemaDefinitions.findIndex(def =>
        def.includes(`const ${modelName}Schema = new Schema(`)
      );

      if (schemaIndex !== -1) {
        // Insert the additional methods before the model definition
        const parts = schemaDefinitions[schemaIndex].split(`const ${modelName} = mongoose.model`);
        schemaDefinitions[schemaIndex] = parts[0] + additionalMethods + `const ${modelName} = mongoose.model` + parts[1];
      }
    }
  });

  result += schemaDefinitions.join('\n');
  result += `\nmodule.exports = {\n`;
  schema.tables.forEach(table => {
    const modelName = capitalizeFirstLetter(singularize(table.name));
    result += `  ${modelName},\n`;
  });
  result += `};\n`;

  return result;
}

// Utilitaires

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function singularize(str: string): string {
  // Règles basiques de singularisation
  if (str.endsWith('ies')) {
    return str.slice(0, -3) + 'y';
  } else if (str.endsWith('s') && !str.endsWith('ss')) {
    return str.slice(0, -1);
  }
  return str;
}

function pluralize(str: string): string {
  // Règles basiques de pluralisation
  if (str.endsWith('y') && !str.endsWith('ay') && !str.endsWith('ey') && !str.endsWith('oy') && !str.endsWith('uy')) {
    return str.slice(0, -1) + 'ies';
  } else if (str.endsWith('s') || str.endsWith('x') || str.endsWith('ch') || str.endsWith('sh')) {
    return str + 'es';
  } else {
    return str + 's';
  }
}

function getSequelizeType(column: SQLColumn): string {
  if (column.type.includes('VARCHAR')) {
    const length = column.type.match(/\((\d+)\)/)?.[1] || '255';
    return `DataTypes.STRING(${length})`;
  } else if (column.type.includes('TEXT')) {
    return 'DataTypes.TEXT';
  } else if (column.type.includes('CHAR')) {
    const length = column.type.match(/\((\d+)\)/)?.[1] || '255';
    return `DataTypes.CHAR(${length})`;
  } else if (column.type.includes('INT')) {
    return 'DataTypes.INTEGER';
  } else if (column.type.includes('FLOAT')) {
    return 'DataTypes.FLOAT';
  } else if (column.type.includes('DECIMAL')) {
    const precision = column.type.match(/\((\d+),\s*(\d+)\)/);
    if (precision) {
      return `DataTypes.DECIMAL(${precision[1]}, ${precision[2]})`;
    }
    return 'DataTypes.DECIMAL';
  } else if (column.type.includes('BOOLEAN') || column.type.includes('BOOL')) {
    return 'DataTypes.BOOLEAN';
  } else if (column.type.includes('DATE')) {
    return 'DataTypes.DATEONLY';
  } else if (column.type.includes('TIME')) {
    return 'DataTypes.TIME';
  } else if (column.type.includes('TIMESTAMP')) {
    return 'DataTypes.DATE';
  } else if (column.type.includes('ENUM')) {
    const values = column.type.match(/\(([^)]+)\)/)?.[1].replace(/["']/g, '').split(',');
    return `DataTypes.ENUM(${values?.map(v => `'${v.trim()}'`).join(', ')})`;
  } else if (column.type.includes('JSON')) {
    return 'DataTypes.JSON';
  } else {
    return 'DataTypes.STRING';
  }
}

function getTypeORMColumnType(column: SQLColumn): string {
  let columnType = '';

  if (column.type.includes('VARCHAR') || column.type.includes('CHAR')) {
    const length = column.type.match(/\((\d+)\)/)?.[1];
    columnType = length ? `'varchar', { length: ${length} }` : `'varchar'`;
  } else if (column.type.includes('TEXT')) {
    columnType = `'text'`;
  } else if (column.type.includes('INT')) {
    columnType = `'int'`;
  } else if (column.type.includes('FLOAT')) {
    columnType = `'float'`;
  } else if (column.type.includes('DECIMAL')) {
    const precision = column.type.match(/\((\d+),\s*(\d+)\)/);
    if (precision) {
      columnType = `'decimal', { precision: ${precision[1]}, scale: ${precision[2]} }`;
    } else {
      columnType = `'decimal'`;
    }
  } else if (column.type.includes('BOOLEAN') || column.type.includes('BOOL')) {
    columnType = `'boolean'`;
  } else if (column.type.includes('DATE')) {
    columnType = `'date'`;
  } else if (column.type.includes('TIME')) {
    columnType = `'time'`;
  } else if (column.type.includes('TIMESTAMP')) {
    columnType = `'timestamp'`;
  } else if (column.type.includes('ENUM')) {
    const values = column.type.match(/\(([^)]+)\)/)?.[1].replace(/["']/g, '').split(',');
    columnType = `'enum', { enum: [${values?.map(v => `'${v.trim()}'`).join(', ')}] }`;
  } else if (column.type.includes('JSON')) {
    columnType = `'json'`;
  } else {
    columnType = `'varchar'`;
  }

  return columnType;
}

function getTypeORMColumnOptions(column: SQLColumn): string {
  const options = [getTypeORMColumnType(column)];

  if (column.nullable === false) {
    options.push(`nullable: false`);
  }

  if (column.unique) {
    options.push(`unique: true`);
  }

  if (column.default) {
    if (column.default === 'CURRENT_TIMESTAMP') {
      options.push(`default: () => 'CURRENT_TIMESTAMP'`);
    } else if (column.default === 'NULL') {
      options.push(`default: null`);
    } else {
      options.push(`default: ${column.default}`);
    }
  }

  return `{ ${options.join(', ')} }`;
}

function getTypeORMPropertyType(column: SQLColumn): string {
  if (column.type.includes('VARCHAR') || column.type.includes('TEXT') || column.type.includes('CHAR')) {
    return 'string';
  } else if (column.type.includes('INT') || column.type.includes('FLOAT') || column.type.includes('DECIMAL') || column.type.includes('DOUBLE')) {
    return 'number';
  } else if (column.type.includes('BOOLEAN') || column.type.includes('BOOL')) {
    return 'boolean';
  } else if (column.type.includes('DATE') || column.type.includes('TIME') || column.type.includes('TIMESTAMP')) {
    return 'Date';
  } else if (column.type.includes('ENUM')) {
    const values = column.type.match(/\(([^)]+)\)/)?.[1].replace(/["']/g, '').split(',');
    return values?.map(v => `'${v.trim()}'`).join(' | ') || 'string';
  } else if (column.type.includes('JSON')) {
    return 'any';
  } else {
    return 'string';
  }
}

function getPrismaFieldType(column: SQLColumn): string {
  if (column.type.includes('VARCHAR') || column.type.includes('CHAR') || column.type.includes('TEXT')) {
    return 'String';
  } else if (column.type.includes('INT')) {
    return 'Int';
  } else if (column.type.includes('DECIMAL') || column.type.includes('FLOAT') || column.type.includes('DOUBLE')) {
    return 'Float';
  } else if (column.type.includes('BOOLEAN') || column.type.includes('BOOL')) {
    return 'Boolean';
  } else if (column.type.includes('DATE') || column.type.includes('TIME') || column.type.includes('TIMESTAMP')) {
    return 'DateTime';
  } else if (column.type.includes('JSON')) {
    return 'Json';
  } else if (column.type.includes('ENUM')) {
    // Prisma requires enum types to be defined separately
    const enumName = `${capitalizeFirstLetter(column.name)}Enum`;
    // In a real implementation, we should track these and define them
    return enumName;
  } else {
    return 'String';
  }
}

function getMongooseFieldDefinition(column: SQLColumn): string {
  const fieldName = column.name;
  let fieldDefinition = `  ${fieldName}: `;

  // Handle types
  if (column.type.includes('VARCHAR') || column.type.includes('TEXT') || column.type.includes('CHAR')) {
    fieldDefinition += '{ type: String';
  } else if (column.type.includes('INT') || column.type.includes('FLOAT') || column.type.includes('DECIMAL') || column.type.includes('DOUBLE')) {
    fieldDefinition += '{ type: Number';
  } else if (column.type.includes('BOOL')) {
    fieldDefinition += '{ type: Boolean';
  } else if (column.type.includes('DATE') || column.type.includes('TIME')) {
    fieldDefinition += '{ type: Date';
  } else if (column.type.includes('ENUM')) {
    const enumValues = column.type.match(/\(([^)]+)\)/)?.[1].replace(/["']/g, '').split(',');
    fieldDefinition += `{ type: String, enum: [${enumValues?.map(v => `'${v.trim()}'`).join(', ')}]`;
  } else {
    fieldDefinition += '{ type: Schema.Types.Mixed';
  }

  // Handle constraints
  if (column.constraints) {
    if (!column.nullable) {
      fieldDefinition += ', required: true';
    }

    if (column.unique) {
      fieldDefinition += ', unique: true';
    }

    if (column.default) {
      if (column.default === 'CURRENT_TIMESTAMP') {
        fieldDefinition += ', default: Date.now';
      } else if (column.default === 'NULL') {
        fieldDefinition += ', default: null';
      } else {
        fieldDefinition += `, default: ${column.default}`;
      }
    }
  }

  fieldDefinition += ' }';
  return fieldDefinition;
}

function findTablesWithReference(tables: SQLTable[], tableName: string): Array<{ table: SQLTable, column: SQLColumn }> {
  const result: Array<{ table: SQLTable, column: SQLColumn }> = [];

  tables.forEach(table => {
    table.columns.forEach(column => {
      if (column.foreignKey && column.referencedTable === tableName) {
        result.push({ table, column });
      }
    });
  });

  return result;
}