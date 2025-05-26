import { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

declare module 'mysql2/promise' {
  interface Connection {
    database: string;
    type: string;
  }

  interface RowDataPacket {
    [key: string]: any;
  }
}

export type QueryResult = RowDataPacket[] | RowDataPacket[][] | OkPacket[] | ResultSetHeader[]; 