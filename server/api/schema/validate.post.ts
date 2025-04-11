import { createError, defineEventHandler, readBody } from 'h3';
import { SchemaConfig } from '../../../utils/robots/types';
import { validateSchemaConfig } from '../../../utils/robots/utils';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const config = body.config as SchemaConfig;

    if (!config) {
      throw createError({
        statusCode: 400,
        message: 'Configuration manquante'
      });
    }

    const validationResult = validateSchemaConfig(config);
    return validationResult;
  } catch (error) {
    console.error('Erreur lors de la validation Schema.org:', error);
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la validation Schema.org'
    });
  }
}); 