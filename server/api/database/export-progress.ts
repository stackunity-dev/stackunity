import { defineEventHandler, getQuery } from 'h3';
import { executeQuery } from './pool';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const connectionId = query.connectionId;

  if (!connectionId) {
    event.node.res.statusCode = 400;
    event.node.res.end('Missing connection ID');
    return;
  }

  event.node.res.setHeader('Content-Type', 'text/event-stream');
  event.node.res.setHeader('Cache-Control', 'no-cache');
  event.node.res.setHeader('Connection', 'keep-alive');
  event.node.res.flushHeaders();

  const send = (data: any) => {
    event.node.res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const tablesResult = await executeQuery(connectionId as string, 'SHOW TABLES', []);
    const tables = tablesResult.results.map(row => Object.values(row)[0]);
    const total = tables.length;

    send({ status: 'start', total });

    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];

      try {
        await executeQuery(connectionId as string, `DESCRIBE \`${table}\``, []);
        await executeQuery(connectionId as string, `SELECT * FROM \`${table}\` LIMIT 1000`, []);
      } catch (err) {
        send({ status: 'error', table, error: err.message });
        continue;
      }

      send({ status: 'progress', current: i + 1, table });
    }

    send({ status: 'done' });
    event.node.res.end();
  } catch (error: any) {
    send({ status: 'error', error: error.message });
    event.node.res.end();
  }
});
