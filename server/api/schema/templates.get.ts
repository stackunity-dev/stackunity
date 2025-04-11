import { defineEventHandler } from 'h3';
import { SCHEMA_TEMPLATES } from '../../../utils/robots/utils';

export default defineEventHandler(() => {
  return SCHEMA_TEMPLATES;
}); 