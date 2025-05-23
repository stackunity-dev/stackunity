import { createError, defineEventHandler, getQuery } from 'h3'
import { getUserId } from '../../utils/auth-utils'
import { pool } from '../db'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = Number(query.limit) || 50
    const offset = Number(query.offset) || 0
    const type = query.type as string
    const priority = query.priority as string
    const userId = await getUserId(event)

    console.log('Fetching notifications for user:', userId)

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Non autorisé'
      })
    }

    let sql = `
      SELECT n.*, 
             GROUP_CONCAT(nt.tag) as tags,
             u.username as creator_name
      FROM notifications n
      LEFT JOIN notification_tags nt ON n.id = nt.notification_id
      LEFT JOIN users u ON n.created_by = u.id
      WHERE n.created_by = ?
    `

    const conditions: string[] = []
    const params: (string | number)[] = [String(userId)]

    if (type) {
      conditions.push('n.type = ?')
      params.push(type)
    }

    if (priority) {
      conditions.push('n.priority = ?')
      params.push(priority)
    }

    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ')
    }

    sql += ' GROUP BY n.id ORDER BY n.created_at DESC LIMIT ? OFFSET ?'
    params.push(String(limit), String(offset))

    const [notifications] = await pool.execute(sql, params) as [any[], any]

    // Formater les tags
    const formattedNotifications = notifications.map((notification: any) => ({
      ...notification,
      tags: notification.tags ? notification.tags.split(',') : []
    }))

    return {
      notifications: formattedNotifications,
      pagination: {
        limit,
        offset,
        total: notifications.length
      }
    }
  } catch (error: any) {
    console.error('Error in notifications GET:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des notifications',
      cause: error.message
    })
  }
}) 