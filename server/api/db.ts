import * as mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'process.env.DB_HOST || "localhost""localhost""localhost"',
  port: parseInt(process.env.DB_PORT || "3306"),
  user: 'process.env.DB_USER || "root""root""root"',
  password: 'process.env.DB_PASSWORD || """"""',
  database: process.env.DB_NAME || "default_db"
});

