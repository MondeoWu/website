import * as Router from 'koa-joi-router'
import { createHelper, updateHelper, deleteHelper, findBusiness } from '../helpers/business'
import { Business } from '../../db/models/Business'
import Boom from 'boom'

export const router = Router()

router.route({
  method: 'post',
  path: '/',
  ...createHelper,
  handler: [async (ctx) => {
    const business = await Business.create({userID: ctx.state.user.id, ...ctx.request.body})
    console.log(business)
    ctx.body = { body: business }
  }]
})

router.route({
  method: 'put',
  path: '/:id',
  ...updateHelper,
  handler: [async (ctx) => {
    console.log(ctx.params.id)
    const business = await findBusiness(ctx.params.id)
    const params = ctx.request.body
    params['location'] = JSON.stringify(params['location'])
    await business.update(params)
    ctx.body = { body: business }
  }]
})

router.route({
  method: 'delete',
  path: '/:id',
  ...deleteHelper,
  handler: [async (ctx) => {
    console.log(ctx.params.id)
    const business = await findBusiness(ctx.params.id)
    business.update({deletedAt: new Date().toUTCString()})
    ctx.body = { body: true }
  }]
})