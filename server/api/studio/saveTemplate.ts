import { pool } from '../db';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const { templateName, templateData, componentType, userId } = await readBody(event);
  console.log(templateName, templateData, componentType);

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