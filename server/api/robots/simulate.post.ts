import { createError, defineEventHandler, readBody } from 'h3';
import { RobotsConfig } from '../../../utils/robots/types';
import { simulateRobotsAccess } from '../../../utils/robots/utils';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { config, url }: { config: RobotsConfig; url: string } = body;

    if (!config || !url) {
      throw createError({
        statusCode: 400,
        message: 'Configuration ou URL manquante'
      });
    }

    const simulationResult = simulateRobotsAccess(config, url);
    return simulationResult;
  } catch (error) {
    console.error('Erreur lors de la simulation:', error);
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la simulation du comportement des robots'
    });
  }
}); 