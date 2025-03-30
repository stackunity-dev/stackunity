import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const { templateName, templateData, componentType } = await readBody(event);
  console.log(templateName, templateData, componentType);
  const userId = event.context.user.id;

  try {
    const result = await pool.execute('INSERT INTO studio_components (name, content, user_id, component_type) VALUES (?, ?, ?, ?)', [templateName, templateData, userId, componentType]);
    console.log(result);
    return {
      success: true,
      message: 'Template saved successfully'
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to save template'
    };
  }
})