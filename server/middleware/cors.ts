import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  event.node.res.setHeader('Access-Control-Allow-Origin', '*');
  event.node.res.setHeader('Access-Control-Allow-Credentials', 'true');
  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}); 