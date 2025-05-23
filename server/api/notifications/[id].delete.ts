import { createError, defineEventHandler } from 'h3'
import { pool } from '../db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const user = event.context.user

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Non autorisé'
      })
    }

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID de notification manquant'
      })
    }

    // Vérifier si la notification existe
    const [rows] = await pool.execute(
      'SELECT * FROM notifications WHERE id = ?',
      [id]
    ) as [any[], any]

    if (!rows.length) {
      throw createError({
        statusCode: 404,
        message: 'Notification non trouvée'
      })
    }

    // Supprimer la notification (les tags seront supprimés automatiquement grâce à ON DELETE CASCADE)
    await pool.execute(
      'DELETE FROM notifications WHERE id = ?',
      [id]
    )

    return {
      message: 'Notification supprimée avec succès'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la suppression de la notification',
      cause: error.cause
    })
  }
}) 