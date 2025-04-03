import { pool } from '../db';
import { readBody, defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body)

  try {

    if (body.type === 'world') {
      const [worldSnippetsRows] = await pool.execute('UPDATE world_snippets SET content = ? WHERE id = ?', [body.code, body.id]);

      return {
        success: true,
        data: {
          worldSnippets: worldSnippetsRows
        }
      }
    } else {
      const [personalSnippetsRows] = await pool.execute('UPDATE personal_snippets SET content = ? WHERE id = ? AND user_id = ?', [body.code, body.id, body.userId]);

      return {
        success: true,
        data: {
          personalSnippet: personalSnippetsRows
        }
      }
    }
  }
  catch (err: any) {
    console.error(err.message, err.stack);
    return {
      success: false,
      error: err.message
    }
  }
})