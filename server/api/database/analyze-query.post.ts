import { defineEventHandler, readBody } from 'h3';

interface Warning {
  icon: string;
  title: string;
  description: string;
}

interface Optimization {
  icon: string;
  title: string;
  description: string;
  improvementPercent: number;
  optimizedQuery: string;
}

interface IndexSuggestion {
  sql: string;
  description: string;
}

interface ExecutionStep {
  operation: string;
  description: string;
  cost: number;
  warning?: string;
}

interface ExecutionPlan {
  totalCost: number;
  steps: ExecutionStep[];
}

interface AnalysisResult {
  queryType: string;
  affectedTables: string[];
  tableDetails: Array<{ name: string; columns: string[] }>;
  warnings: Warning[];
  indexSuggestions: IndexSuggestion[];
  optimizations: Optimization[];
  executionPlan: ExecutionPlan;
  efficiency: number;
  estimatedTime: number;
}

class SimpleSqlParser {
  parseQuery(query: string): any {
    const trimmedQuery = query.trim().toUpperCase();
    let queryType = '';
    if (trimmedQuery.startsWith('SELECT')) queryType = 'select';
    else if (trimmedQuery.startsWith('INSERT')) queryType = 'insert';
    else if (trimmedQuery.startsWith('UPDATE')) queryType = 'update';
    else if (trimmedQuery.startsWith('DELETE')) queryType = 'delete';
    else if (trimmedQuery.startsWith('CREATE')) queryType = 'create';
    else if (trimmedQuery.startsWith('ALTER')) queryType = 'alter';
    else if (trimmedQuery.startsWith('DROP')) queryType = 'drop';
    else queryType = 'unknown';

    const tables = this.extractTables(query);

    const hasWhere = /\sWHERE\s/i.test(query);

    return {
      type: queryType,
      from: tables.map(table => ({ table })),
      where: hasWhere ? {} : null,
      orderby: /\sORDER\s+BY\s/i.test(query) ? {} : null,
      limit: /\sLIMIT\s+\d+/i.test(query) ? { value: [{ value: this.extractLimit(query) }] } : null
    };
  }

  extractTables(query: string): string[] {
    const tables: string[] = [];

    const fromRegex = /\bFROM\s+([a-zA-Z0-9_]+)/gi;
    let fromMatch;
    while ((fromMatch = fromRegex.exec(query)) !== null) {
      tables.push(fromMatch[1]);
    }

    const joinRegex = /\bJOIN\s+([a-zA-Z0-9_]+)/gi;
    let joinMatch;
    while ((joinMatch = joinRegex.exec(query)) !== null) {
      tables.push(joinMatch[1]);
    }

    const intoRegex = /\b(INTO|UPDATE)\s+([a-zA-Z0-9_]+)/gi;
    let intoMatch;
    while ((intoMatch = intoRegex.exec(query)) !== null) {
      tables.push(intoMatch[2]);
    }

    return [...new Set(tables)];
  }

  extractLimit(query: string): number {
    const limitRegex = /\bLIMIT\s+(\d+)/i;
    const match = query.match(limitRegex);
    return match ? parseInt(match[1]) : 0;
  }

  astify(query: string): any {
    try {
      return this.parseQuery(query);
    } catch (error) {
      throw new Error(`Erreur d'analyse SQL: ${error.message}`);
    }
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { connectionId, query } = body;

    if (!query) {
      return {
        success: false,
        message: 'Requête SQL requise'
      };
    }

    const sqlParser = new SimpleSqlParser();
    let parsedQuery: any;
    let queryType = '';

    try {
      parsedQuery = sqlParser.astify(query);
      queryType = parsedQuery.type.toUpperCase() || query.trim().split(' ')[0].toUpperCase();

    } catch (parseError: any) {
      queryType = query.trim().split(' ')[0].toUpperCase();

      const result: AnalysisResult = {
        queryType,
        affectedTables: [],
        tableDetails: [],
        warnings: [{
          icon: 'mdi-alert-circle',
          title: 'Erreur de syntaxe SQL',
          description: `Impossible d'analyser la requête: ${parseError.message}`
        }],
        indexSuggestions: [],
        optimizations: [],
        executionPlan: {
          totalCost: 100,
          steps: [{
            operation: 'PARSE_ERROR',
            description: 'Impossible d\'analyser la requête SQL',
            cost: 100,
            warning: parseError.message
          }]
        },
        efficiency: 0,
        estimatedTime: 0
      };

      return {
        success: true,
        data: result
      };
    }

    const singleQuery = Array.isArray(parsedQuery) ? parsedQuery[0] : parsedQuery;

    const affectedTables: string[] = [];

    if (singleQuery.from) {
      singleQuery.from.forEach(fromItem => {
        if (fromItem.table) {
          affectedTables.push(fromItem.table);
        }
      });
    }

    if (affectedTables.length === 0) {
      sqlParser.extractTables(query).forEach(table => {
        affectedTables.push(table);
      });
    }

    const tableDetails = affectedTables.map(table => ({
      name: table,
      columns: []
    }));

    const warnings: Warning[] = [];

    if ((queryType === 'SELECT' || queryType === 'UPDATE' || queryType === 'DELETE') && !singleQuery.where) {
      warnings.push({
        icon: 'mdi-table',
        title: 'Missing WHERE clause',
        description: `This ${queryType} query executes without a WHERE condition, which can affect all rows of the table.`
      });
    }

    if (queryType === 'SELECT' && query.toUpperCase().includes('SELECT *')) {
      warnings.push({
        icon: 'mdi-star-circle',
        title: 'Using SELECT *',
        description: 'Selecting all columns can reduce performance. Specify only the columns you need.'
      });
    }

    const optimizations: Optimization[] = [];

    if (query.toUpperCase().includes('SELECT *')) {
      optimizations.push({
        icon: 'mdi-select-search',
        title: 'Select only required columns',
        description: 'Avoid SELECT * and specify only the columns you need.',
        improvementPercent: 25,
        optimizedQuery: query.replace(/SELECT \*/i, 'SELECT id, name, created_at')
      });
    }

    if (queryType === 'SELECT' && !query.toUpperCase().includes('LIMIT')) {
      optimizations.push({
        icon: 'mdi-table-filter',
        title: 'Add a LIMIT clause',
        description: 'Limit the number of results to improve performance.',
        improvementPercent: 40,
        optimizedQuery: `${query} LIMIT 100`
      });
    }

    const indexSuggestions: IndexSuggestion[] = [];

    const whereColumns = extractWhereColumns(query);
    whereColumns.forEach(column => {
      if (column.includes('.')) {
        const [table, columnName] = column.split('.');
        indexSuggestions.push({
          sql: `CREATE INDEX idx_${table}_${columnName} ON ${table} (${columnName});`,
          description: `To optimize filters on ${column}`
        });
      } else if (affectedTables.length === 1) {
        indexSuggestions.push({
          sql: `CREATE INDEX idx_${affectedTables[0]}_${column} ON ${affectedTables[0]} (${column});`,
          description: `To optimize filters on ${column}`
        });
      }
    });

    const orderByRegex = /ORDER BY\s+([a-zA-Z0-9_.,\s]+)/i;
    const groupByRegex = /GROUP BY\s+([a-zA-Z0-9_.,\s]+)/i;
    const joinRegex = /JOIN\s+([a-zA-Z0-9_]+)/gi;
    const orderByMatch = query.match(orderByRegex);
    const groupByMatch = query.match(groupByRegex);
    const joinMatches = [...query.matchAll(joinRegex)].map(m => m[1]);

    const orderByCols = orderByMatch ? orderByMatch[1].split(',').map(s => s.trim()) : [];
    const groupByCols = groupByMatch ? groupByMatch[1].split(',').map(s => s.trim()) : [];

    orderByCols.concat(groupByCols).forEach(col => {
      if (col && !whereColumns.includes(col)) {
        warnings.push({
          icon: 'mdi-sort',
          title: 'ORDER BY/GROUP BY without index',
          description: `The column '${col}' used in ORDER BY or GROUP BY is not filtered in WHERE. An index could improve performance.`
        });
      }
    });

    if (joinMatches.length > 0 && whereColumns.length === 0) {
      warnings.push({
        icon: 'mdi-link-variant',
        title: 'Jointure sans index',
        description: `The query uses JOIN but no common column is filtered in WHERE. This can lead to expensive joins.`
      });
    }

    const alreadySuggested = new Set(indexSuggestions.map(s => s.sql));
    orderByCols.concat(groupByCols).forEach(col => {
      if (col && affectedTables.length === 1) {
        const sql = `CREATE INDEX idx_${affectedTables[0]}_${col} ON ${affectedTables[0]} (${col});`;
        if (!alreadySuggested.has(sql)) {
          indexSuggestions.push({
            sql,
            description: `To optimize sorts or groupings on ${col}`
          });
          alreadySuggested.add(sql);
        }
      }
    });
    joinMatches.forEach(table => {
      if (table && affectedTables.includes(table)) {
        const sql = `CREATE INDEX idx_${table}_join ON ${table} (id);`;
        if (!alreadySuggested.has(sql)) {
          indexSuggestions.push({
            sql,
            description: `To optimize joins on ${table}`
          });
          alreadySuggested.add(sql);
        }
      }
    });

    if ((queryType === 'SELECT' || queryType === 'UPDATE' || queryType === 'DELETE') && !singleQuery.where) {
      optimizations.push({
        icon: 'mdi-filter-outline',
        title: 'Add a WHERE clause',
        description: 'Add a WHERE clause to limit the impact of the query.',
        improvementPercent: 30,
        optimizedQuery: query + ' WHERE 1=1'
      });
    }

    if (whereColumns.length > 1 && affectedTables.length === 1) {
      const sql = `CREATE INDEX idx_${affectedTables[0]}_${whereColumns.join('_')} ON ${affectedTables[0]} (${whereColumns.join(', ')});`;
      if (!alreadySuggested.has(sql)) {
        indexSuggestions.push({
          sql,
          description: `Composite index to optimize filters on (${whereColumns.join(', ')})`
        });
      }
    }

    if (queryType === 'SELECT' && /SELECT\s+\*/i.test(query)) {
      if (!warnings.some(w => w.title.includes('SELECT *'))) {
        warnings.push({
          icon: 'mdi-star-circle',
          title: 'SELECT * usage',
          description: 'Using SELECT * can reduce performance and expose sensitive data. Specify only the needed columns.'
        });
      }
      if (!optimizations.some(o => o.title.includes('columns'))) {
        optimizations.push({
          icon: 'mdi-select-search',
          title: 'Select only required columns',
          description: 'Avoid SELECT * and specify only the columns you need.',
          improvementPercent: 20,
          optimizedQuery: query.replace(/SELECT \*/i, 'SELECT id, name')
        });
      }
    }

    if (whereColumns.length > 0 && affectedTables.length === 1) {
      whereColumns.forEach(col => {
        const sql = `CREATE INDEX idx_${affectedTables[0]}_${col} ON ${affectedTables[0]} (${col});`;
        if (!indexSuggestions.some(s => s.sql === sql)) {
          indexSuggestions.push({
            sql,
            description: `To optimize filters on ${col}`
          });
        }
      });
    }

    if (queryType === 'SELECT' && /LIMIT\s+\d+/i.test(query) && !/OFFSET\s+\d+/i.test(query)) {
      optimizations.push({
        icon: 'mdi-page-next-outline',
        title: 'Add OFFSET for pagination',
        description: 'Use OFFSET with LIMIT for efficient pagination.',
        improvementPercent: 10,
        optimizedQuery: query + ' OFFSET 0'
      });
    }

    if (queryType === 'SELECT' && /WHERE[\s\S]*?(>|<|>=|<=)/i.test(query)) {
      warnings.push({
        icon: 'mdi-alert-outline',
        title: 'Range scan in WHERE',
        description: 'Using range comparisons (>, <, >=, <=) in WHERE may prevent index usage or cause full scans.'
      });
    }

    if (queryType === 'SELECT' && !/ORDER BY/i.test(query)) {
      warnings.push({
        icon: 'mdi-sort-variant-remove',
        title: 'No ORDER BY clause',
        description: 'Results are not ordered. Add ORDER BY for predictable output.'
      });
    }

    const hasAggregation = /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(query);
    const hasGroupBy = /\bGROUP BY\b/i.test(query);
    const hasHaving = /\bHAVING\b/i.test(query);

    if (hasAggregation && !hasGroupBy) {
      warnings.push({
        icon: 'mdi-function',
        title: 'Aggregation without GROUP BY',
        description: 'Using aggregation functions without GROUP BY will return a single row. Consider if this is intended.'
      });
    }

    if (hasHaving && !hasGroupBy) {
      warnings.push({
        icon: 'mdi-alert-circle',
        title: 'HAVING without GROUP BY',
        description: 'HAVING clause is used without GROUP BY. This might not work as expected.'
      });
    }

    if (hasGroupBy) {
      const groupByMatch = query.match(/GROUP BY\s+([^,\s]+)/i);
      if (groupByMatch && affectedTables.length === 1) {
        const groupByColumn = groupByMatch[1].trim();
        const sql = `CREATE INDEX idx_${affectedTables[0]}_group_${groupByColumn} ON ${affectedTables[0]} (${groupByColumn});`;
        if (!indexSuggestions.some(s => s.sql === sql)) {
          indexSuggestions.push({
            sql,
            description: `To optimize GROUP BY operations on ${groupByColumn}`
          });
        }
      }
    }

    if (/\bCOUNT\s*\(\s*\*\s*\)/i.test(query) && !/\bWHERE\b/i.test(query)) {
      warnings.push({
        icon: 'mdi-counter',
        title: 'COUNT(*) without WHERE',
        description: 'Counting all rows without WHERE clause can be slow on large tables. Consider adding a condition.'
      });
    }

    if (hasAggregation && query.includes('(') && query.includes(')')) {
      optimizations.push({
        icon: 'mdi-database-search',
        title: 'Optimize subquery with aggregation',
        description: 'Consider using JOIN or CTE instead of subquery with aggregation for better performance.',
        improvementPercent: 30,
        optimizedQuery: query.replace(/\(\s*SELECT\s+.*?FROM\s+.*?\)/i, 'WITH agg AS (SELECT ... FROM ...)')
      });
    }

    if (hasGroupBy && whereColumns.length > 0 && affectedTables.length === 1) {
      const groupByMatch = query.match(/GROUP BY\s+([^,\s]+)/i);
      if (groupByMatch) {
        const groupByColumn = groupByMatch[1].trim();
        const compositeColumns = [...whereColumns, groupByColumn];
        const sql = `CREATE INDEX idx_${affectedTables[0]}_where_group ON ${affectedTables[0]} (${compositeColumns.join(', ')});`;
        if (!indexSuggestions.some(s => s.sql === sql)) {
          indexSuggestions.push({
            sql,
            description: `Composite index to optimize both WHERE and GROUP BY operations`
          });
        }
      }
    }

    const executionPlan: ExecutionPlan = {
      totalCost: 100,
      steps: [
        {
          operation: queryType,
          description: `Opération sur ${affectedTables.join(', ')}`,
          cost: 60
        }
      ]
    };

    if (queryType === 'SELECT') {
      if (singleQuery.where) {
        executionPlan.steps.push({
          operation: 'FILTER',
          description: 'Application des conditions WHERE',
          cost: 15
        });
      }

      if (singleQuery.orderby) {
        executionPlan.steps.push({
          operation: 'SORT',
          description: 'Tri des résultats',
          cost: 15,
          warning: 'Les opérations de tri peuvent être coûteuses sur de grands ensembles de données'
        });
      }

      if (singleQuery.limit) {
        executionPlan.steps.push({
          operation: 'LIMIT',
          description: `Limitation à ${singleQuery.limit.value[0].value} résultats`,
          cost: 5
        });
      }
    }

    // Calcul d'efficacité basé sur les warnings et optimisations
    const baseEfficiency = 80;
    const warningPenalty = warnings.length * 10;
    const optimizationBonus = optimizations.length ? 0 : 10;
    const efficiency = Math.min(100, Math.max(0, baseEfficiency - warningPenalty + optimizationBonus));

    // Estimation du temps d'exécution (simulée)
    const estimatedTime = Math.floor(Math.random() * 200) + 50;

    const result: AnalysisResult = {
      queryType,
      affectedTables,
      tableDetails,
      warnings,
      indexSuggestions,
      optimizations,
      executionPlan,
      efficiency,
      estimatedTime
    };

    return {
      success: true,
      data: result
    };

  } catch (error: any) {
    console.error('Erreur lors de l\'analyse de la requête SQL:', error);
    return {
      success: false,
      message: `Erreur lors de l'analyse: ${error.message}`
    };
  }
});

function extractWhereColumns(query: string): string[] {
  const columns = new Set<string>();

  // Extraction de la clause WHERE complète
  const whereRegex = /WHERE\s+([^;]+?)(?=\s+(?:GROUP|ORDER|LIMIT|$)|$)/i;
  const whereMatch = query.match(whereRegex);

  if (whereMatch) {
    const whereClause = whereMatch[1];

    // Extraction des colonnes avec opérateurs de comparaison
    const comparisonRegex = /([a-zA-Z0-9_\.]+)\s*(?:=|>|<|>=|<=|!=|LIKE|IN|BETWEEN|IS|NOT|EXISTS)/gi;
    let match;
    while ((match = comparisonRegex.exec(whereClause)) !== null) {
      const column = match[1].split('.').pop() || match[1];
      columns.add(column);
    }

    // Extraction des colonnes dans les conditions AND/OR
    const andOrRegex = /(?:AND|OR)\s+([a-zA-Z0-9_\.]+)\s*(?:=|>|<|>=|<=|!=|LIKE|IN|BETWEEN|IS|NOT|EXISTS)/gi;
    while ((match = andOrRegex.exec(whereClause)) !== null) {
      const column = match[1].split('.').pop() || match[1];
      columns.add(column);
    }

    // Extraction des colonnes dans les sous-requêtes
    const subqueryRegex = /\(\s*SELECT\s+.*?FROM\s+.*?WHERE\s+([^)]+?)(?=\s+(?:GROUP|ORDER|LIMIT|$)|$)/gi;
    while ((match = subqueryRegex.exec(whereClause)) !== null) {
      const subqueryWhere = match[1];
      const subqueryColumns = extractWhereColumns(`WHERE ${subqueryWhere}`);
      subqueryColumns.forEach(col => columns.add(col));
    }
  }

  return Array.from(columns);
} 