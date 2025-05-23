import { createError, defineEventHandler, readBody } from 'h3';
import { executeQuery } from './pool';

interface QueryResult {
  results?: any[];
  fields?: any[];
  affectedRows?: number;
  message?: string;
  error?: string;
  executionTime: number;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { connectionId, query, params } = body;

    const user = event.context.user || { id: 'demo-user' };

    if (!connectionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Database connection ID is required'
      });
    }

    if (!query || typeof query !== 'string' || !query.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'A valid SQL query is required'
      });
    }

    const startTime = Date.now();

    const queryType = getQueryType(query);

    validateQuery(query);

    console.log(`Executing ${queryType} query on connection ${connectionId}`);
    console.log(`Query: ${maskSensitiveData(query)}`);

    try {
      const result = await executeQuery(connectionId, query, params || []);

      const executionTime = Date.now() - startTime;

      if (result.results) {
        console.log(`Query returned ${Array.isArray(result.results) ? result.results.length : 0} rows.`);
      } else if (result.affectedRows !== undefined) {
        console.log(`Query executed successfully. ${result.affectedRows} rows affected.`);
      } else {
        console.log('Query executed successfully.');
      }

      return {
        success: true,
        results: result.results,
        fields: result.fields,
        affectedRows: result.affectedRows,
        executionTime
      };
    } catch (error: any) {
      console.error('Error executing query:', error);

      const sqlError = {
        message: error.message || 'Failed to execute query',
        code: error.code || error.errno || error.sqlState,
        sqlState: error.sqlState || error.sqlMessage
      };

      return {
        success: false,
        message: sqlError.message,
        code: sqlError.code,
        sqlState: sqlError.sqlState,
        executionTime: Date.now() - startTime
      };
    }
  } catch (error: any) {
    console.error('Error processing query request:', error);

    return {
      success: false,
      message: error.message || 'Failed to execute SQL query',
      code: error.code || error.statusCode || 500,
      sqlState: error.sqlState
    };
  }
});

function getQueryType(query: string): string {
  const normalizedQuery = query.trim().toUpperCase();

  const firstWord = normalizedQuery.split(/\s+/)[0];

  if (firstWord === 'WITH' && normalizedQuery.includes('SELECT')) {
    return 'SELECT';
  }

  if (firstWord === 'BEGIN' || firstWord === 'START') {
    return 'BEGIN';
  }

  return firstWord;
}

function validateQuery(query: string): void {
  const normalizedQuery = query.trim().toUpperCase();

  const dangerousPatterns = [
    /DROP\s+DATABASE/i,
    /DROP\s+SCHEMA/i,
    /TRUNCATE\s+DATABASE/i,
    /SYSTEM\s+/i,
    /EXEC\s+XP_/i,
    /SHUTDOWN/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(normalizedQuery)) {
      throw new Error('Potentially harmful operation detected. This query is not allowed.');
    }
  }
}

function maskSensitiveData(query: string): string {
  let maskedQuery = query.replace(/password\s*=\s*['"][^'"]*['"]|pwd\s*=\s*['"][^'"]*['"]|pass\s*=\s*['"][^'"]*['"]|password:\s*['"][^'"]*['"]|pwd:\s*['"][^'"]*['"]|pass:\s*['"][^'"]*['"]/gi, match => {
    const parts = match.split(/[=:]/);
    return `${parts[0]}="*****"`;
  });

  maskedQuery = maskedQuery.replace(/\b(?:\d{4}[-\s]?){3}\d{4}\b/g, '****-****-****-****');

  return maskedQuery;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(): string {
  const start = new Date();
  start.setFullYear(start.getFullYear() - 2);

  const end = new Date();

  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  return date.toISOString();
} 