import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const origin = event.node.req.headers.origin

  if (origin) {
    event.node.res.setHeader('Access-Control-Allow-Origin', origin)
    event.node.res.setHeader('Access-Control-Allow-Credentials', 'true')
  }

  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (event.node.req.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.end()
    return
  }
})
