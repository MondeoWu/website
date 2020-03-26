import * as Router from 'koa-joi-router'
import { createHelper } from '../helpers/business'
import { Business } from '../../db/models/Business'

export const router = Router()

router.route({
  method: 'post',
  path: '/',
  ...createHelper,
  handler: [async (ctx) => {
    console.log(ctx.state.user.id)
    const business = await Business.create({userID: ctx.state.user.id, ...ctx.request.body})
    console.log(business)
    ctx.body = {
      body: business
    }
  }]
})