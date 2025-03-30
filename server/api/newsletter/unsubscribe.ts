import { pool } from '../db'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  try {
    const subscriber = await pool.execute('DELETE FROM newsletters_subscribers WHERE email = ?', [email])
    const count = await pool.execute('UPDATE newsletters SET subscribers = GREATEST(subscribers - 1, 0)')
    return { success: true, message: 'Email désinscrit avec succès', subscriber, count }
  } catch (error) {
    return { success: false, message: 'Erreur lors de la désinscription' }
  }
})
