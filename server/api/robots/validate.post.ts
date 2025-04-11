import { createError, defineEventHandler, readBody } from 'h3';
import { RobotsConfig } from '../../../utils/robots/types';
import { validateRobotsConfig } from '../../../utils/robots/utils';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const config: RobotsConfig = body.config;

    if (!config) {
      throw createError({
        statusCode: 400,
        message: 'Configuration manquante'
      });
    }

    const validationResult = validateRobotsConfig(config);
    return validationResult;
  } catch (error) {
    console.error('Erreur lors de la validation:', error);
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la validation de la configuration'
    });
  }
}); 