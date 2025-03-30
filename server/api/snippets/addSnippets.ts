import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body)

  const userId = event.context.user?.id;

  try {
    if (body.publishWorld === true) {
      const [worldSnippetsRows] = await pool.execute('INSERT INTO world_snippets (img, title, description, username, framework, snippet_date) VALUES (?, ?, ?, ?, ?, ?)', [
        body.img,
        body.title,
        body.description,
        body.username,
        body.framework,
        body.date
      ]);
      const [personalSnippetsRows] = await pool.execute('INSERT INTO personal_snippets (img, title, description, username, framework, snippet_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [
        body.img,
        body.title,
        body.description,
        body.username,
        body.framework,
        body.date,
        userId
      ]);

      return {
        success: true,
      }
    } else {
      const [personalSnippetsRows] = await pool.execute('INSERT INTO personal_snippets (img, title, description, username, framework, snippet_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [
        body.img,
        body.title,
        body.description,
        body.username,
        body.framework,
        body.date,
        userId
      ]);

      return {
        success: true,
      }
    }
  }
  catch (err: any) {
    console.error("Error add snippets :", err.message, err.stack);
  }
})