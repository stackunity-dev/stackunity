export interface DatabaseConnection {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  database_name?: string;
}

export interface TerminalLine {
  content: string;
  type: 'command' | 'result' | 'error' | 'info';
}


export interface TableSize {
  table_name: string;
  size_mb: number;
}
