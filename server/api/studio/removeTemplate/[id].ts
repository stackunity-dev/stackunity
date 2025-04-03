import { pool } from '../../db';
import { defineEventHandler, createError, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  console.log('Deleting template with ID:', body.templateId);
  console.log('User ID:', body.userId);

  if (!body.templateId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Template ID is required'
    });
  }

  try {
    const result = await pool.query('DELETE FROM studio_components WHERE id = ? AND user_id = ?', [body.templateId, body.userId]);

    console.log('Delete result:', result);

    return {
      success: true,
      message: 'Template deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting template:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error deleting template'
    })
  }
})
