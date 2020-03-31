import * as Router from 'koa-joi-router'
import { createHelper } from '../helpers/businessCanvas'

export const router = Router()

router.route({
  method: 'post',
  meta: {
    swagger: {
      tags: ['Admin']
    }
  },
  path: '/',
  ...createHelper.validate,
  handler: [async (ctx) => {
    ctx.body = {
      
    }
  }]
})