export type DatabaseType = 'mysql' | 'postgres' | 'sqlite' | 'mssql';

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  default: string | null;
  isPrimary: boolean;
  index?: string;
}

export interface Relation {
  name: string;
  type: 'foreign' | 'primary';
  description: string;
}

export interface DatabaseNode {
  name: string;
  type: 'table' | 'view' | 'index' | 'function';
  columns?: Column[];
  definition?: string;
  table?: string;
  relations?: Relation[];
  rowCount?: number;
  children?: DatabaseNode[];
}

export interface DatabaseConnection {
  id: string;
  name: string;
  type: DatabaseType;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  userId?: string;
}

export interface TablePreview {
  columns: string[];
  rows: Record<string, any>[];
}

export interface DatabaseStructure {
  tables: DatabaseNode[];
  views: DatabaseNode[];
  indexes: DatabaseNode[];
  functions: DatabaseNode[];
} 