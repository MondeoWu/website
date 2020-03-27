import * as Router from 'koa-joi-router'
import { createHelper, updateHelper, deleteHelper, showHelper, employeeHelper, findBusiness } from '../helpers/business'
import { Business } from '../../db/models/Business'
import { User } from '../../db/models/User'
import { BusinessEmployee } from '../../db/models/BusinessEmployee'
import { Canvas } from '../../db/models/Canvas'

export const router = Router()

router.route({
  method: 'post',
  path: '/',
  ...createHelper,
  handler: [async (ctx) => {
    console.log(ctx.request.body)
    // TODO
    const params = ctx.request.body
    params['location'] = JSON.stringify(params['location'])
    const business = await Business.create(
      { userID: ctx.state.user.id, ...ctx.request.body },
      { include: [BusinessEmployee] }
    )
    ctx.body = { body: business }
  }]
})

router.route({
  method: 'put',
  path: '/:id',
  ...updateHelper,
  handler: [async (ctx) => {
    console.log(ctx.params.id)
    const business = await findBusiness(ctx)
    // TODO
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
    const business = await findBusiness(ctx)
    business.update({deletedAt: new Date().toUTCString()})
    ctx.body = { body: true }
  }]
})

router.route({
  method: 'get',
  path: '/employee',
  ...employeeHelper,
  handler: [async (ctx) => {
    const res = await User.sequelize.query(
      "SELECT id, name, email FROM users WHERE name LIKE :query OR email LIKE :query ORDER BY name ASC",
      { replacements: { query: `%${ctx.query.q.toLowerCase()}%` }}
    )
    ctx.body = { body: JSON.stringify(res[0]) }
  }]
})

router.route({
  method: 'get',
  path: '/:id',
  ...showHelper,
  handler: [async (ctx) => {
    const business = await findBusiness(ctx)
    ctx.body = { body: JSON.stringify(business) }
  }]
})