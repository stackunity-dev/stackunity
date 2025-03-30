import { pool } from '../../db';

export default defineEventHandler(async (event) => {
  const templateId = event.context.params?.id;
  const userId = event.context.user?.id;

  console.log('Deleting template with ID:', templateId);
  console.log('User ID:', userId);

  if (!templateId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Template ID is required'
    });
  }

  try {
    const result = await pool.query('DELETE FROM studio_components WHERE id = ? AND user_id = ?', [templateId, userId]);

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
