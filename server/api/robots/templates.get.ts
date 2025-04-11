import { defineEventHandler } from 'h3';
import { ROBOTS_TEMPLATES } from '../../../utils/robots/utils';

export default defineEventHandler(() => {
  return ROBOTS_TEMPLATES;
}); 