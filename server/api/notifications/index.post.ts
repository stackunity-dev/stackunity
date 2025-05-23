import { createError, defineEventHandler, readBody } from 'h3';
import { getUserId } from '../../utils/auth-utils';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const userId = await getUserId(event)

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Non autorisé'
      })
    }

    // Validation des données
    if (!body.title || !body.message || !body.type || !body.priority) {
      throw createError({
        statusCode: 400,
        message: 'Données manquantes'
      })
    }

    // Insertion de la notification
    const [result] = await pool.execute(
      `INSERT INTO notifications (
        title, message, type, priority, 
        is_sticky, requires_action, action_text, 
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.title,
        body.message,
        body.type,
        body.priority,
        body.is_sticky || false,
        body.requires_action || false,
        body.action_text || null,
        userId
      ]
    )

    const notificationId = (result as any).insertId

    // Insertion des tags si présents
    if (body.tags && body.tags.length > 0) {
      const tagValues = body.tags.map((tag: string) => [notificationId, tag])
      await pool.query(
        'INSERT INTO notification_tags (notification_id, tag) VALUES ?',
        [tagValues]
      )
    }

    // Récupération de la notification créée avec ses tags
    const [notifications] = await pool.execute(
      `SELECT n.*, GROUP_CONCAT(nt.tag) as tags
       FROM notifications n
       LEFT JOIN notification_tags nt ON n.id = nt.notification_id
       WHERE n.id = ?
       GROUP BY n.id`,
      [notificationId]
    )

    const notification = notifications[0]
    return {
      ...notification,
      tags: notification.tags ? notification.tags.split(',') : []
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la création de la notification',
      cause: error.cause
    })
  }
}) 