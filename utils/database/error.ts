import { Diagnostic } from '@codemirror/lint';

export const sqlLinter = (view: any) => {
  const { state } = view;
  const diagnostics: Diagnostic[] = [];
  const content = state.doc.toString();
  const lines = content.split('\n');

  let inConstraintContext = false;
  let constraintStartLine = -1;

  lines.forEach((line: string, i: number) => {
    const upperLine = line.toUpperCase().trim();
    const lineNumber = i + 1;
    const from = state.doc.line(lineNumber).from;
    const to = from + line.length;

    if (upperLine.includes('CONSTRAINT') || upperLine.includes('FOREIGN KEY')) {
      inConstraintContext = true;
      constraintStartLine = i;
    }

    if (inConstraintContext && upperLine.includes(';')) {
      inConstraintContext = false;
    }

    if (inConstraintContext) {
      return;
    }

    if (upperLine.includes('FROM') && !upperLine.match(/FROM\s+[A-Za-z0-9_]+/)) {
      diagnostics.push({
        from,
        to,
        severity: 'error' as const,
        message: 'Missing table name after FROM clause'
      });
    }

    if (upperLine.includes('JOIN') && !upperLine.includes('ON')) {
      diagnostics.push({
        from,
        to,
        severity: 'error' as const,
        message: 'Missing ON clause after JOIN'
      });
    }

    if (upperLine.includes('WHERE') && !upperLine.match(/WHERE\s+.+/)) {
      diagnostics.push({
        from,
        to,
        severity: 'error' as const,
        message: 'Missing condition after WHERE clause'
      });
    }

    if (upperLine.includes('GROUP BY') && !upperLine.match(/GROUP BY\s+.+/)) {
      diagnostics.push({
        from,
        to,
        severity: 'error' as const,
        message: 'Missing columns after GROUP BY clause'
      });
    }

    if (upperLine.includes('ORDER BY') && !upperLine.match(/ORDER BY\s+.+/)) {
      diagnostics.push({
        from,
        to,
        severity: 'error' as const,
        message: 'Missing columns after ORDER BY clause'
      });
    }

    if (upperLine.includes('CREATE TABLE') && !upperLine.match(/CREATE TABLE\s+[A-Za-z0-9_]+\s*\(/)) {
      diagnostics.push({
        from,
        to,
        severity: 'error' as const,
        message: 'Missing table definition after CREATE TABLE'
      });
    }

    if (upperLine.includes('INSERT INTO') && !upperLine.match(/INSERT INTO\s+[A-Za-z0-9_]+\s+(VALUES|SELECT)/)) {
      diagnostics.push({
        from,
        to,
        severity: 'error' as const,
        message: 'Missing VALUES or SELECT after INSERT INTO'
      });
    }

    if (upperLine.includes('UPDATE') && !upperLine.includes('SET')) {
      diagnostics.push({
        from,
        to,
        severity: 'error' as const,
        message: 'Missing SET clause after UPDATE'
      });
    }

    if (upperLine.includes('DELETE') && !upperLine.includes('FROM')) {
      diagnostics.push({
        from,
        to,
        severity: 'error' as const,
        message: 'Missing FROM clause after DELETE'
      });
    }

    if (upperLine.includes('ALTER TABLE') && !upperLine.match(/ALTER TABLE\s+[A-Za-z0-9_]+\s+(ADD|DROP|MODIFY|CHANGE)/)) {
      diagnostics.push({
        from,
        to,
        severity: 'error' as const,
        message: 'Missing action (ADD/DROP/MODIFY/CHANGE) after ALTER TABLE'
      });
    }
  });

  return diagnostics;
}; 