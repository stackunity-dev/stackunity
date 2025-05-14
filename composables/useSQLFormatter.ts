// Implémentation simplifiée du formateur SQL sans dépendance externe

export function useSQLFormatter() {
  /**
   * Formate une requête SQL pour la rendre plus lisible
   * @param sql La requête SQL à formater
   * @returns La requête SQL formatée
   */
  const formatSQL = (sql: string): string => {
    if (!sql.trim()) return '';

    try {
      // Implémentation simplifiée du formatage SQL
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
        'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES',
        'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
        'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL'
      ];

      // Mettre en majuscules les mots-clés SQL
      let formattedSQL = sql.trim();

      // Remplacer les mots-clés par leur version en majuscules avec saut de ligne
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formattedSQL = formattedSQL.replace(regex, `\n${keyword.toUpperCase()}`);
      });

      // Ajouter une indentation
      formattedSQL = formattedSQL.split('\n').map((line, index) => {
        return index === 0 ? line : '  ' + line;
      }).join('\n');

      return formattedSQL;
    } catch (error) {
      console.error('Error formatting SQL:', error);
      return sql; // Retourne l'entrée originale en cas d'erreur
    }
  };

  return {
    formatSQL
  };
} 