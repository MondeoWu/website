import * as Router from 'koa-joi-router'
import { User } from '../db/models/User'
export const router = Router()

router.route({
  method: 'get',
  path: '/first',
  meta: {
    swagger: {
      summary: 'first user',
      tags: ['user']
    }
  },
  handler: async (ctx) => {
    const u = await User.findOne({where: {id: 1}})
    ctx.body = JSON.stringify(u)
    ctx.status = 200;
  }
})
