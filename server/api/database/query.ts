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

    // Mesurer le temps d'exécution
    const startTime = Date.now();

    // Analyser la requête pour déterminer son type
    const queryType = getQueryType(query);

    // Vérifier si la requête est potentiellement dangereuse
    validateQuery(query);

    // Journaliser la requête (sans les informations sensibles)
    console.log(`Executing ${queryType} query on connection ${connectionId}`);
    console.log(`Query: ${maskSensitiveData(query)}`);

    // Exécuter la requête via le pool de connexion
    try {
      const result = await executeQuery(connectionId, query, params || []);

      // Ajouter le temps d'exécution
      const executionTime = Date.now() - startTime;

      // Journaliser le résultat
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
    } catch (error) {
      console.error('Error executing query:', error);
      return {
        success: false,
        message: error.message || 'Failed to execute query',
        executionTime: Date.now() - startTime
      };
    }
  } catch (error: any) {
    console.error('Error processing query request:', error);

    return {
      success: false,
      error: error.message || 'Failed to execute SQL query',
      errorCode: error.statusCode || 500
    };
  }
});

/**
 * Détermine le type de requête SQL
 */
function getQueryType(query: string): string {
  const normalizedQuery = query.trim().toUpperCase();

  // Extraire le premier mot significatif
  const firstWord = normalizedQuery.split(/\s+/)[0];

  // Gérer les cas spéciaux
  if (firstWord === 'WITH' && normalizedQuery.includes('SELECT')) {
    return 'SELECT'; // CTE avec SELECT
  }

  if (firstWord === 'BEGIN' || firstWord === 'START') {
    return 'BEGIN'; // Début de transaction
  }

  return firstWord;
}

/**
 * Valide la requête pour détecter les injections SQL ou les opérations dangereuses
 */
function validateQuery(query: string): void {
  const normalizedQuery = query.trim().toUpperCase();

  // Liste de mots-clés potentiellement dangereux
  const dangerousPatterns = [
    /DROP\s+DATABASE/i,
    /DROP\s+SCHEMA/i,
    /TRUNCATE\s+DATABASE/i,
    /SYSTEM\s+/i,
    /EXEC\s+XP_/i,
    /SHUTDOWN/i
  ];

  // Vérifier si la requête contient des motifs dangereux
  for (const pattern of dangerousPatterns) {
    if (pattern.test(normalizedQuery)) {
      throw new Error('Potentially harmful operation detected. This query is not allowed.');
    }
  }
}

/**
 * Masque les données sensibles dans la requête pour la journalisation
 */
function maskSensitiveData(query: string): string {
  // Masquer les mots de passe
  let maskedQuery = query.replace(/password\s*=\s*['"][^'"]*['"]|pwd\s*=\s*['"][^'"]*['"]|pass\s*=\s*['"][^'"]*['"]|password:\s*['"][^'"]*['"]|pwd:\s*['"][^'"]*['"]|pass:\s*['"][^'"]*['"]/gi, match => {
    const parts = match.split(/[=:]/);
    return `${parts[0]}="*****"`;
  });

  // Masquer les numéros de carte de crédit
  maskedQuery = maskedQuery.replace(/\b(?:\d{4}[-\s]?){3}\d{4}\b/g, '****-****-****-****');

  return maskedQuery;
}

/**
 * Simule l'exécution d'une requête SELECT
 */
async function simulateSelectQuery(query: string, database: string, params?: any[]): Promise<QueryResult> {
  // Extraire le nom de la table à partir de la requête
  const tableMatch = query.match(/FROM\s+([a-z0-9_]+)/i);
  const tableName = tableMatch ? tableMatch[1].toLowerCase() : 'unknown';

  // Extraire les colonnes demandées
  const columnsMatch = query.match(/SELECT\s+(.*?)\s+FROM/i);
  const columnsStr = columnsMatch ? columnsMatch[1].trim() : '*';
  const isSelectAll = columnsStr === '*';

  // Analyser la clause WHERE si présente
  const whereMatch = query.match(/WHERE\s+(.*?)(?:ORDER BY|GROUP BY|LIMIT|$)/i);
  const whereClause = whereMatch ? whereMatch[1].trim() : '';

  // Analyser la clause ORDER BY si présente
  const orderByMatch = query.match(/ORDER BY\s+(.*?)(?:LIMIT|$)/i);
  const orderByClause = orderByMatch ? orderByMatch[1].trim() : '';

  // Analyser la clause LIMIT si présente
  const limitMatch = query.match(/LIMIT\s+(\d+)(?:\s*,\s*(\d+)|)/i);
  const limitValue = limitMatch ? parseInt(limitMatch[1], 10) : 0;
  const offsetValue = limitMatch && limitMatch[2] ? parseInt(limitMatch[2], 10) : 0;

  // Générer des données factices en fonction de la table
  let fields: { name: string, type: string }[] = [];
  let results: any[] = [];

  // Définir les colonnes et données selon la table
  if (tableName.includes('user')) {
    fields = [
      { name: 'id', type: 'int' },
      { name: 'username', type: 'varchar' },
      { name: 'email', type: 'varchar' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'status', type: 'varchar' }
    ];

    // Générer des données utilisateur
    for (let i = 1; i <= randomInt(15, 30); i++) {
      results.push({
        id: i,
        username: `user${i}`,
        email: `user${i}@example.com`,
        created_at: randomDate(),
        status: ['active', 'inactive', 'pending'][randomInt(0, 2)]
      });
    }
  } else if (tableName.includes('product')) {
    fields = [
      { name: 'id', type: 'int' },
      { name: 'name', type: 'varchar' },
      { name: 'description', type: 'text' },
      { name: 'price', type: 'decimal' },
      { name: 'stock', type: 'int' },
      { name: 'category', type: 'varchar' }
    ];

    // Générer des données produit
    for (let i = 1; i <= randomInt(20, 40); i++) {
      results.push({
        id: i,
        name: `Product ${i}`,
        description: `Description for product ${i}. High quality item.`,
        price: (Math.random() * 1000).toFixed(2),
        stock: randomInt(0, 100),
        category: ['Electronics', 'Books', 'Clothing', 'Home'][randomInt(0, 3)]
      });
    }
  } else if (tableName.includes('order')) {
    fields = [
      { name: 'id', type: 'int' },
      { name: 'user_id', type: 'int' },
      { name: 'total', type: 'decimal' },
      { name: 'date', type: 'timestamp' },
      { name: 'status', type: 'varchar' }
    ];

    // Générer des données commande
    for (let i = 1; i <= randomInt(10, 25); i++) {
      results.push({
        id: i,
        user_id: randomInt(1, 10),
        total: (Math.random() * 500 + 10).toFixed(2),
        date: randomDate(),
        status: ['pending', 'shipped', 'delivered', 'cancelled'][randomInt(0, 3)]
      });
    }
  } else {
    // Table générique
    fields = [
      { name: 'id', type: 'int' },
      { name: 'name', type: 'varchar' },
      { name: 'description', type: 'text' },
      { name: 'created_at', type: 'timestamp' }
    ];

    // Générer des données génériques
    for (let i = 1; i <= randomInt(15, 35); i++) {
      results.push({
        id: i,
        name: `Item ${i}`,
        description: `Description for item ${i}`,
        created_at: randomDate()
      });
    }
  }

  // Appliquer le filtrage WHERE (simulation simplifiée)
  if (whereClause) {
    // Simuler un filtrage basique sur l'ID
    const idMatch = whereClause.match(/id\s*=\s*(\d+)/i);
    if (idMatch) {
      const idValue = parseInt(idMatch[1], 10);
      results = results.filter(item => item.id === idValue);
    }

    // Simuler un filtrage sur le statut
    const statusMatch = whereClause.match(/status\s*=\s*['"]([^'"]+)['"]/i);
    if (statusMatch) {
      const statusValue = statusMatch[1];
      results = results.filter(item => item.status === statusValue);
    }
  }

  // Appliquer le tri ORDER BY (simulation simplifiée)
  if (orderByClause) {
    const orderParts = orderByClause.split(/\s+/);
    const orderField = orderParts[0];
    const orderDirection = orderParts[1]?.toUpperCase() === 'DESC' ? -1 : 1;

    results.sort((a, b) => {
      if (a[orderField] < b[orderField]) return -1 * orderDirection;
      if (a[orderField] > b[orderField]) return 1 * orderDirection;
      return 0;
    });
  }

  // Appliquer la pagination LIMIT/OFFSET
  if (limitValue > 0) {
    const start = offsetValue;
    const end = start + limitValue;
    results = results.slice(start, end);
  }

  // Filtrer les colonnes si nécessaire
  if (!isSelectAll && columnsStr !== '*') {
    const requestedColumns = columnsStr.split(',').map(col => col.trim().split(' as ')[0].split('.').pop()?.trim() || '');

    results = results.map(row => {
      const filteredRow: Record<string, any> = {};
      requestedColumns.forEach(col => {
        if (row.hasOwnProperty(col)) {
          filteredRow[col] = row[col];
        }
      });
      return filteredRow;
    });

    // Mettre à jour les champs pour refléter uniquement les colonnes demandées
    fields = fields.filter(field => requestedColumns.includes(field.name));
  }

  return {
    results,
    fields,
    executionTime: 0 // Sera mis à jour par l'appelant
  };
}

/**
 * Simule l'exécution d'une requête de modification (INSERT, UPDATE, DELETE)
 */
async function simulateModificationQuery(queryType: string, query: string): Promise<QueryResult> {
  // Déterminer le nombre de lignes affectées en fonction du type de requête
  let affectedRows: number;

  if (queryType === 'INSERT') {
    // Détecter les insertions multiples
    const valuesMatches = query.match(/VALUES\s*\(/gi);
    if (valuesMatches && valuesMatches.length > 1) {
      affectedRows = valuesMatches.length;
    } else {
      affectedRows = 1;
    }
  } else if (queryType === 'UPDATE') {
    // Pour les mises à jour, simuler un nombre variable de lignes affectées
    affectedRows = randomInt(1, 10);
  } else if (queryType === 'DELETE') {
    // Pour les suppressions, simuler un nombre variable de lignes affectées
    affectedRows = randomInt(0, 5);
  } else {
    affectedRows = 0;
  }

  let message = '';
  switch (queryType) {
    case 'INSERT':
      message = `${affectedRows} row(s) inserted successfully.`;
      break;
    case 'UPDATE':
      message = `${affectedRows} row(s) updated successfully.`;
      break;
    case 'DELETE':
      message = `${affectedRows} row(s) deleted successfully.`;
      break;
    default:
      message = 'Query executed successfully.';
  }

  return {
    affectedRows,
    message,
    executionTime: 0 // Sera mis à jour par l'appelant
  };
}

/**
 * Simule l'exécution d'une requête DDL (CREATE, ALTER, DROP)
 */
async function simulateDDLQuery(queryType: string, query: string): Promise<QueryResult> {
  // Extraire le type d'objet (TABLE, INDEX, etc.)
  const objectTypeMatch = query.match(new RegExp(`${queryType}\\s+(TABLE|DATABASE|INDEX|VIEW|PROCEDURE|FUNCTION|TRIGGER)`, 'i'));
  const objectType = objectTypeMatch ? objectTypeMatch[1].toLowerCase() : 'object';

  // Extraire le nom de l'objet
  const objectNameMatch = query.match(new RegExp(`${queryType}\\s+(?:TABLE|DATABASE|INDEX|VIEW|PROCEDURE|FUNCTION|TRIGGER)?\\s+(?:IF\\s+(?:NOT\\s+)?EXISTS\\s+)?([a-z0-9_]+)`, 'i'));
  const objectName = objectNameMatch ? objectNameMatch[1] : '';

  let message = '';
  switch (queryType) {
    case 'CREATE':
      message = `${objectType} ${objectName} created successfully.`;
      break;
    case 'ALTER':
      message = `${objectType} ${objectName} altered successfully.`;
      break;
    case 'DROP':
      message = `${objectType} ${objectName} dropped successfully.`;
      break;
    default:
      message = 'DDL statement executed successfully.';
  }

  return {
    message,
    executionTime: 0 // Sera mis à jour par l'appelant
  };
}

/**
 * Simule l'exécution d'une requête de transaction
 */
async function simulateTransactionQuery(queryType: string): Promise<QueryResult> {
  let message = '';

  switch (queryType) {
    case 'BEGIN':
    case 'START':
      message = 'Transaction started.';
      break;
    case 'COMMIT':
      message = 'Transaction committed successfully.';
      break;
    case 'ROLLBACK':
      message = 'Transaction rolled back.';
      break;
    default:
      message = 'Transaction command executed.';
  }

  return {
    message,
    executionTime: 0 // Sera mis à jour par l'appelant
  };
}

/**
 * Génère un nombre entier aléatoire entre min et max (inclus)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Génère une date aléatoire entre il y a 2 ans et maintenant
 */
function randomDate(): string {
  const start = new Date();
  start.setFullYear(start.getFullYear() - 2);

  const end = new Date();

  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  return date.toISOString();
} 