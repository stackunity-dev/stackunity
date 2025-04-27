export interface SQLColumn {
  name: string;
  type: string;
  constraints?: string[];
  nullable?: boolean;
  defaultType?: string;
  default?: string;
  foreignKey?: boolean;
  referencedTable?: string;
  referencedColumn?: string;
  unique?: boolean;
  autoIncrement?: boolean;
  primaryKey?: boolean;
  notNull?: boolean;
}

export interface SQLTable {
  id?: string;
  name: string;
  columns: SQLColumn[];
  foreignKeys?: any[];
  defaultOptions?: any[];
}

export interface SQLSchema {
  id?: number;
  database_name: string;
  tables: SQLTable[];
  schema_data?: string;
}

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
  defaultType?: string;
  primaryKey: boolean;
  foreignKey?: boolean;
  notNull?: boolean;
  unique: boolean;
  autoIncrement: boolean;
  referencedTable?: string;
  referencedColumn?: string;
  constraints?: string[];
}

export interface ForeignKey {
  id: string;
  columnName: string;
  referenceTable: string;
  referenceColumn: string;
  onDelete: string;
  onUpdate: string;
}

export interface DefaultOptions {
  title: string;
  nullable: boolean;
  current_timestamp: boolean;
  custom: boolean;
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
  foreignKeys: ForeignKey[];
  defaultOptions: DefaultOptions[];
}

export interface StoredTable {
  name: string;
  columns: SQLColumn[];
}

export enum DatabaseType {
  SQL = 'sql',
  NOSQL = 'nosql',
  ORM = 'orm'
}

export interface ConversionOptions {
  includeTimestamps?: boolean;
  ormType?: 'sequelize' | 'typeorm' | 'prisma' | 'mongoose';
  nosqlType?: 'mongodb' | 'firestore' | 'dynamodb';
}

