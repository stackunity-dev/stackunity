import { createError, defineEventHandler, readBody } from 'h3';
import { SchemaConfig, SchemaTemplate } from '../../../utils/robots/types';
import { applyTemplate } from '../../../utils/robots/utils';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { config, template } = body as { config: SchemaConfig; template: SchemaTemplate };

    if (!config || !template) {
      throw createError({
        statusCode: 400,
        message: 'Configuration ou template manquant'
      });
    }

    const result = applyTemplate(config, template);
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'application du template:', error);
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de l\'application du template'
    });
  }
}); 