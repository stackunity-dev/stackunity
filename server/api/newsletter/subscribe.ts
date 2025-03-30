import { pool } from "../db";

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  try {
    const [result] = await pool.execute('INSERT INTO newsletters_subscribers (email) VALUES (?)', [email]);

    await pool.execute('UPDATE newsletters SET subscribers = subscribers + 1');

    return result;
  } catch (error) {
    console.error('Erreur lors de l\'inscription à la newsletter:', error);
    return { error: 'Erreur lors de l\'inscription à la newsletter' };
  }
});
