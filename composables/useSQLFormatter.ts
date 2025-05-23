export function useSQLFormatter() {
  const formatSQL = (sql: string): string => {
    if (!sql.trim()) return '';

    try {
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
        'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES',
        'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
        'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL'
      ];

      let formattedSQL = sql.trim();

      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formattedSQL = formattedSQL.replace(regex, `\n${keyword.toUpperCase()}`);
      });

      formattedSQL = formattedSQL.split('\n').map((line, index) => {
        return index === 0 ? line : '  ' + line;
      }).join('\n');

      return formattedSQL;
    } catch (error) {
      console.error('Error formatting SQL:', error);
      return sql;
    }
  };

  return {
    formatSQL
  };
} 