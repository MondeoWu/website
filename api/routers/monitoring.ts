import * as Boom from 'boom'
import * as Router from 'koa-joi-router'
export const router = Router()

router.route({
  method: 'get',
  path: '/health-check',
  meta: {
    swagger: {
      summary: 'Monitoring health check',
      tags: ['Monitoring']
    }
  },
  handler: async (ctx) => {
    ctx.status = 200;
  }
})
