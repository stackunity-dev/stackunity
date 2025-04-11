import { createError, defineEventHandler, readBody } from 'h3';
import { SchemaConfig } from '../../../utils/robots/types';
import { generateSchemaContent } from '../../../utils/robots/utils';

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

    const schemaContent = generateSchemaContent(config, body.type);
    return { content: schemaContent };
  } catch (error) {
    console.error('Erreur lors de la génération Schema.org:', error);
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la génération Schema.org'
    });
  }
}); 