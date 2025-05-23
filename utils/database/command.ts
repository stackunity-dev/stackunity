import { CompletionContext } from '@codemirror/autocomplete';
import axios from 'axios';

export interface SQLCompletion {
  label: string;
  type: string;
  info: string;
  render?: (el: HTMLElement) => void;
}

export const SQL_KEYWORDS: SQLCompletion[] = [
  {
    label: 'SELECT',
    type: 'keyword',
    info: 'Retrieve data from a table',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'FROM',
    type: 'keyword',
    info: 'Specify the source table',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'WHERE',
    type: 'keyword',
    info: 'Filter the results',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'INSERT',
    type: 'keyword',
    info: 'Insert new rows',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'UPDATE',
    type: 'keyword',
    info: 'Modify existing rows',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'DELETE',
    type: 'keyword',
    info: 'Delete rows',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'CREATE',
    type: 'keyword',
    info: 'Create a new database object',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'DROP',
    type: 'keyword',
    info: 'Delete a database object',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'ALTER',
    type: 'keyword',
    info: 'Modify a database object',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'JOIN',
    type: 'keyword',
    info: 'Combine rows from multiple tables',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'GROUP BY',
    type: 'keyword',
    info: 'Group rows by specified columns',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'ORDER BY',
    type: 'keyword',
    info: 'Sort the result set',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'HAVING',
    type: 'keyword',
    info: 'Filter groups after GROUP BY',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'LIMIT',
    type: 'keyword',
    info: 'Limit the number of rows returned',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'PRIMARY KEY',
    type: 'keyword',
    info: 'Define a primary key constraint',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'FOREIGN KEY',
    type: 'keyword',
    info: 'Define a foreign key constraint',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'AUTO_INCREMENT',
    type: 'keyword',
    info: 'Auto-incrementing column',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'REFERENCES',
    type: 'keyword',
    info: 'Reference a foreign key',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'CONSTRAINT',
    type: 'keyword',
    info: 'Define a constraint',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'DESCRIBE',
    type: 'keyword',
    info: 'Show table structure',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#7dd0ff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  }
];

export const SQL_FUNCTIONS: SQLCompletion[] = [
  {
    label: 'COUNT',
    type: 'function',
    info: 'Count the number of rows',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'SUM',
    type: 'function',
    info: 'Calculate the sum of values',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'AVG',
    type: 'function',
    info: 'Calculate the average of values',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'MAX',
    type: 'function',
    info: 'Find the maximum value',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'MIN',
    type: 'function',
    info: 'Find the minimum value',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'COALESCE',
    type: 'function',
    info: 'Return the first non-null value in a list',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'NULLIF',
    type: 'function',
    info: 'Return NULL if two expressions are equal',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'IFNULL',
    type: 'function',
    info: 'Return a specified value if expression is NULL',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'CONCAT',
    type: 'function',
    info: 'Concatenate strings',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'SUBSTRING',
    type: 'function',
    info: 'Extract a substring from a string',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'TRIM',
    type: 'function',
    info: 'Remove leading and trailing spaces',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'UPPER',
    type: 'function',
    info: 'Convert string to uppercase',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'LOWER',
    type: 'function',
    info: 'Convert string to lowercase',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'DATE_FORMAT',
    type: 'function',
    info: 'Format a date value',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'NOW',
    type: 'function',
    info: 'Get current date and time',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'CURRENT_DATE',
    type: 'function',
    info: 'Get current date',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'CURRENT_TIMESTAMP',
    type: 'function',
    info: 'Get current timestamp',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'DATEDIFF',
    type: 'function',
    info: 'Calculate difference between dates',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'ROUND',
    type: 'function',
    info: 'Round a number to specified decimal places',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'CAST',
    type: 'function',
    info: 'Convert a value to a specified data type',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#82aaff;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  }
];

export const SQL_OPERATORS: SQLCompletion[] = [
  {
    label: 'AND',
    type: 'operator',
    info: 'Logical AND operator',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#ff5370;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'OR',
    type: 'operator',
    info: 'Logical OR operator',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#ff5370;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'NOT',
    type: 'operator',
    info: 'Logical NOT operator',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#ff5370;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'IN',
    type: 'operator',
    info: 'Check if a value exists in a set',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#ff5370;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'BETWEEN',
    type: 'operator',
    info: 'Check if a value is within a range',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#ff5370;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  },
  {
    label: 'LIKE',
    type: 'operator',
    info: 'Pattern matching operator',
    render: (el: HTMLElement) => {
      el.innerHTML = `<span style="color:#ff5370;">${el.textContent}</span> <small style="margin-left:8px;color:#888;">${el.getAttribute('data-info')}</small>`;
    }
  }
];

export interface SQLSnippet {
  label: string;
  snippet: string;
  description: string;
  shortcut?: string;
}

export const SQL_SNIPPETS: SQLSnippet[] = [
  {
    label: 'select-all',
    snippet: 'SELECT * FROM ',
    description: 'Select all columns from a table',
    shortcut: 's*',
  },
  {
    label: 'select-count',
    snippet: 'SELECT COUNT(*) FROM ',
    description: 'Count records in a table',
    shortcut: 'c*',
  },
  {
    label: 'select-join',
    snippet: 'SELECT * FROM [table1] JOIN [table2] ON [table1].id = [table2].id',
    description: 'Join two tables with a simple condition',
    shortcut: 'j*',
  },
  {
    label: 'select-where',
    snippet: 'SELECT * FROM [table] WHERE ',
    description: 'Select with a condition',
    shortcut: 'w*',
  },
  {
    label: 'select-group',
    snippet: 'SELECT [column], COUNT(*) FROM [table] GROUP BY [column]',
    description: 'Group results by column',
    shortcut: 'g*',
  },
  {
    label: 'select-order',
    snippet: 'SELECT * FROM [table] ORDER BY [column] ASC',
    description: 'Sort results by column',
    shortcut: 'o*',
  },
  {
    label: 'foreign-key',
    snippet: 'CONSTRAINT [fk_name]\nFOREIGN KEY ([column_name])\nREFERENCES [other_table]([id])\nON DELETE CASCADE\nON UPDATE CASCADE',
    description: 'Add a foreign key constraint with name',
    shortcut: 'f*',
  },
  {
    label: 'create-table',
    snippet: 'CREATE TABLE [table_name] (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  [column_name] VARCHAR(255) NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n)',
    description: 'Create a new table with basic structure',
    shortcut: 't*',
  },
  {
    label: 'show-tables-by-space',
    snippet: 'SHOW TABLES BY SPACE USED DESC',
    description: 'Show tables sorted by space used',
    shortcut: 's*',
  },
  {
    label: 'show-relations',
    snippet: 'SHOW RELATIONS',
    description: 'Show table relationships and foreign keys',
    shortcut: 'r*',
  }
];

let databaseTables: string[] = [];

export const updateDatabaseTables = async (connectionId: string) => {
  try {
    const response = await axios.post('/api/database/query', {
      connectionId,
      query: 'SHOW TABLES'
    });

    if (response.data.success && response.data.results) {
      databaseTables = response.data.results.map((row: any) => Object.values(row)[0]);
    }
  } catch (error) {
    console.error('Error fetching database tables:', error);
  }
};

export const sqlCompletions = (context: CompletionContext) => {
  const word = context.matchBefore(/[\w\*\[\]]*/);
  if (!word) return null;

  const currentWord = word.text.toLowerCase();
  const line = context.state.doc.lineAt(context.pos);
  const text = line.text;

  const matchingSnippet = SQL_SNIPPETS.find(snippet => {
    const shortcut = localStorage.getItem(`sqlSnippetShortcut_${snippet.label}`) || snippet.shortcut;
    return currentWord === shortcut;
  });

  if (matchingSnippet) {
    return {
      from: word.from,
      to: word.to,
      options: [{
        label: matchingSnippet.snippet,
        type: 'snippet',
        info: matchingSnippet.description
      }]
    };
  }

  // Vérifier si nous sommes sur un placeholder [table]
  const tableRegex = /\[table\d*\]/g;
  let match;
  while ((match = tableRegex.exec(text)) !== null) {
    const start = line.from + match.index;
    const end = start + match[0].length;
    if (context.pos >= start && context.pos <= end) {
      return {
        from: start,
        to: end,
        options: databaseTables.map(table => ({
          label: table,
          type: 'table',
          info: `Table ${table}`
        }))
      };
    }
  }

  // Retourner les suggestions par défaut
  return {
    from: word.from,
    to: word.to,
    options: [
      ...SQL_KEYWORDS,
      ...SQL_FUNCTIONS,
      ...SQL_OPERATORS,
      ...databaseTables.map(table => ({
        label: table,
        type: 'table',
        info: `Table ${table}`
      }))
    ]
  };
}; 