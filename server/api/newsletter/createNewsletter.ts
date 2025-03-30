import { pool } from "../db";

export default defineEventHandler(async (event) => {
  const { name } = await readBody(event);
  try {
    const [result] = await pool.execute('INSERT INTO newsletters (name) VALUES (?)', [name]);
    return result;
  } catch (error) {
    console.error('Erreur lors de la création de la newsletter:', error);
    return { error: 'Erreur lors de la création de la newsletter' };
  }
});
