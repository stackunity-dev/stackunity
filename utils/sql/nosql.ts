import { ConversionOptions, SQLColumn, SQLSchema, SQLTable } from './types';

/**
 * Convertit un schéma SQL en modèle NoSQL (MongoDB/Firestore/DynamoDB)
 */
export function convertToNoSQL(schema: SQLSchema, options: ConversionOptions = {}): string {
  const { nosqlType = 'mongodb' } = options;

  switch (nosqlType) {
    case 'mongodb':
      return convertToMongoDB(schema, options);
    case 'firestore':
      return convertToFirestore(schema, options);
    case 'dynamodb':
      return convertToDynamoDB(schema, options);
    default:
      return convertToMongoDB(schema, options);
  }
}

/**
 * Convertit un schéma SQL en modèle MongoDB
 */
function convertToMongoDB(schema: SQLSchema, options: ConversionOptions = {}): string {
  let result = `const mongoose = require('mongoose');\nconst Schema = mongoose.Schema;\n\n`;

  // Create MongoDB schemas for each table
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
      if (column.name.toLowerCase() === 'id' && column.autoIncrement) {
        return;
      }

      // Handle foreign keys as references
      if (column.foreignKey && column.referencedTable) {
        const refModelName = capitalizeFirstLetter(singularize(column.referencedTable));
        references.push(`  ${column.name}: { type: Schema.Types.ObjectId, ref: '${refModelName}' }`);
      } else {
        fields.push(getMongoDBFieldDefinition(column));
      }
    });

    // Handle timestamps
    if (options.includeTimestamps) {
      fields.push(`  // Automatically managed timestamps`);
    }

    schemaDefinition += [...fields, ...references].join(',\n');
    schemaDefinition += `\n}, { timestamps: ${options.includeTimestamps ? 'true' : 'false'} });\n\n`;

    // Add the model definition
    schemaDefinition += `const ${modelName} = mongoose.model('${modelName}', ${modelName}Schema);\n`;

    schemaDefinitions.push(schemaDefinition);
    modelDefinitions.push(`module.exports.${modelName} = ${modelName};`);
  });

  // Create relationships and handling for arrays of related entities
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

/**
 * Convertit un schéma SQL en modèle Firestore
 */
function convertToFirestore(schema: SQLSchema, options: ConversionOptions = {}): string {
  let result = `const admin = require('firebase-admin');\n`;
  result += `const firestore = admin.firestore();\n\n`;

  // Create collection references
  schema.tables.forEach(table => {
    const collectionName = table.name.toLowerCase();
    result += `const ${collectionName}Collection = firestore.collection('${collectionName}');\n`;
  });

  // Create type definitions
  result += `\n// TypeScript interfaces\n`;

  schema.tables.forEach(table => {
    const typeName = capitalizeFirstLetter(singularize(table.name));
    result += `interface ${typeName} {\n`;
    result += `  id?: string;\n`;

    // Process columns
    table.columns.forEach(column => {
      // Skip id columns (Firestore has ids by default)
      if (column.name.toLowerCase() === 'id' && column.autoIncrement) {
        return;
      }

      const typeInfo = getFirestoreType(column);
      result += `  ${column.name}: ${typeInfo.type}${column.nullable ? ' | null' : ''};\n`;
    });

    // Handle foreign keys - in Firestore, we often denormalize or use references
    const relatedTables = findTablesWithReference(schema.tables, table.name);
    if (relatedTables.length > 0) {
      result += `\n`;
      relatedTables.forEach(rel => {
        const relTypeName = capitalizeFirstLetter(singularize(rel.table.name));
        result += `  ${rel.table.name}Refs?: string[];\n`;
      });
    }

    // Handle timestamps
    if (options.includeTimestamps) {
      result += `  createdAt: Date;\n`;
      result += `  updatedAt: Date;\n`;
    }

    result += `}\n\n`;
  });

  // Add helper functions for common operations
  schema.tables.forEach(table => {
    const typeName = capitalizeFirstLetter(singularize(table.name));
    const collectionName = table.name.toLowerCase();

    // Create
    result += `async function create${typeName}(data: Omit<${typeName}, 'id'>) {
  const docRef = ${collectionName}Collection.doc();
  
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const docData = {
    ...data,
    ${options.includeTimestamps ? `createdAt: timestamp,
    updatedAt: timestamp,` : ''}
  };
  
  await docRef.set(docData);
  return { id: docRef.id, ...docData };
}

`;

    // Get by ID
    result += `async function get${typeName}ById(id: string) {
  const doc = await ${collectionName}Collection.doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() } as ${typeName};
}

`;

    // Update
    result += `async function update${typeName}(id: string, data: Partial<${typeName}>) {
  const docRef = ${collectionName}Collection.doc(id);
  
  const updateData = {
    ...data,
    ${options.includeTimestamps ? `updatedAt: admin.firestore.FieldValue.serverTimestamp(),` : ''}
  };
  
  await docRef.update(updateData);
  return { id, ...updateData };
}

`;

    // Delete
    result += `async function delete${typeName}(id: string) {
  await ${collectionName}Collection.doc(id).delete();
  return true;
}

`;
  });

  // Export all functions
  result += `module.exports = {\n`;
  schema.tables.forEach(table => {
    const typeName = capitalizeFirstLetter(singularize(table.name));
    result += `  create${typeName},\n`;
    result += `  get${typeName}ById,\n`;
    result += `  update${typeName},\n`;
    result += `  delete${typeName},\n`;
  });
  result += `};\n`;

  return result;
}

/**
 * Convertit un schéma SQL en modèle DynamoDB
 */
function convertToDynamoDB(schema: SQLSchema, options: ConversionOptions = {}): string {
  let result = `const AWS = require('aws-sdk');\n`;
  result += `const dynamoDB = new AWS.DynamoDB.DocumentClient();\n\n`;

  const tables: string[] = [];

  schema.tables.forEach(table => {
    const tableName = `${schema.database_name}_${table.name}`;
    const primaryKey = table.columns.find(c => c.name.toLowerCase() === 'id' || c.constraints?.includes('primary'));

    // Build primary key definition
    let keyDefinition = primaryKey ? `${primaryKey.name}` : 'id';

    tables.push(`const ${table.name}TableName = '${tableName}';

const ${table.name}Schema = {
  tableName: ${table.name}TableName,
  
  async create(data) {
    const timestamp = new Date().toISOString();
    const item = {
      ...data,
      ${!primaryKey?.autoIncrement ? `${keyDefinition}: uuidv4(),` : ''}
      ${options.includeTimestamps ? `createdAt: timestamp,
      updatedAt: timestamp,` : ''}
    };
    
    await dynamoDB.put({
      TableName: this.tableName,
      Item: item
    }).promise();
    
    return item;
  },
  
  async getById(id) {
    const result = await dynamoDB.get({
      TableName: this.tableName,
      Key: { ${keyDefinition}: id }
    }).promise();
    
    return result.Item;
  },
  
  async update(id, data) {
    const timestamp = new Date().toISOString();
    
    // Build update expression
    const updateExpressionParts = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    
    Object.entries(data).forEach(([key, value]) => {
      updateExpressionParts.push(\`#\${key} = :\${key}\`);
      expressionAttributeNames[\`#\${key}\`] = key;
      expressionAttributeValues[\`:\${key}\`] = value;
    });
    
    ${options.includeTimestamps ? `// Add updatedAt
    updateExpressionParts.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = timestamp;` : ''}
    
    const updateExpression = \`SET \${updateExpressionParts.join(', ')}\`;
    
    await dynamoDB.update({
      TableName: this.tableName,
      Key: { ${keyDefinition}: id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }).promise();
    
    return { ${keyDefinition}: id, ...data${options.includeTimestamps ? `, updatedAt: timestamp` : ''} };
  },
  
  async delete(id) {
    await dynamoDB.delete({
      TableName: this.tableName,
      Key: { ${keyDefinition}: id }
    }).promise();
    
    return true;
  }
};`);
  });

  result += tables.join('\n\n');

  // Export all schemas
  result += `\n\nmodule.exports = {\n`;
  schema.tables.forEach(table => {
    result += `  ${table.name}Schema,\n`;
  });
  result += `};\n`;

  // Add CloudFormation template as a comment
  result += `\n/*
AWSTemplateFormatVersion: '2010-09-09'
Resources:
`;

  schema.tables.forEach(table => {
    const tableName = `${schema.database_name}${capitalizeFirstLetter(table.name)}`;
    const primaryKey = table.columns.find(c => c.name.toLowerCase() === 'id' || c.constraints?.includes('primary'));

    result += `  ${tableName}Table:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: ${schema.database_name}_${table.name}
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: ${primaryKey?.name || 'id'}
          AttributeType: ${getDynamoDBKeyType(primaryKey)}
      KeySchema:
        - AttributeName: ${primaryKey?.name || 'id'}
          KeyType: HASH
`;

    // Add global secondary indexes for foreign keys
    const foreignKeys = table.columns.filter(c => c.foreignKey);
    if (foreignKeys.length > 0) {
      result += `      GlobalSecondaryIndexes:\n`;
      foreignKeys.forEach(fk => {
        if (fk.name && fk.referencedTable) {
          result += `        - IndexName: ${fk.name}Index
          KeySchema:
            - AttributeName: ${fk.name}
              KeyType: HASH
          Projection:
            ProjectionType: ALL
`;
        }
      });
    }
  });

  result += `*/`;

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

function getMongoDBFieldDefinition(column: SQLColumn): string {
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
      fieldDefinition += `, default: ${column.default}`;
    }
  }

  fieldDefinition += ' }';
  return fieldDefinition;
}

function getFirestoreType(column: SQLColumn): { type: string, comment: string } {
  if (column.type.includes('VARCHAR') || column.type.includes('TEXT') || column.type.includes('CHAR')) {
    return { type: 'string', comment: '' };
  } else if (column.type.includes('INT') || column.type.includes('FLOAT') || column.type.includes('DECIMAL') || column.type.includes('DOUBLE')) {
    return { type: 'number', comment: '' };
  } else if (column.type.includes('BOOLEAN') || column.type.includes('BOOL')) {
    return { type: 'boolean', comment: '' };
  } else if (column.type.includes('DATE') || column.type.includes('TIME') || column.type.includes('TIMESTAMP')) {
    return { type: 'Date', comment: '' };
  } else if (column.type.includes('ENUM')) {
    const enumValues = column.type.match(/\(([^)]+)\)/)?.[1].replace(/["']/g, '').split(',');
    return {
      type: enumValues?.map(v => `'${v.trim()}'`).join(' | ') || 'string',
      comment: ''
    };
  }

  return { type: 'any', comment: '' };
}

function getDynamoDBKeyType(column?: SQLColumn): string {
  if (!column) return 'S'; // Default to string

  if (column.type.includes('INT') || column.type.includes('FLOAT') || column.type.includes('DECIMAL') || column.type.includes('DOUBLE')) {
    return 'N';
  }

  return 'S';
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