import * as Router from 'koa-joi-router'
import { createHelper, updateHelper, deleteHelper, showHelper, employeeHelper, findBusinessCanvas } from '../helpers/businessCanvas'
import { BusinessCanvas } from '../../db/models/BusinessCanvas'
import { User } from '../../db/models/User'
import { BusinessEmployee } from '../../db/models/BusinessEmployee'

export const router = Router()

// create
router.route({
  method: 'post',
  path: '/',
  ...createHelper,
  handler: [async (ctx) => {
    // TODO
    const params = ctx.request.body
    params['location'] = JSON.stringify(params['location'])
    const businessCanvas = await BusinessCanvas.create(
      { userID: ctx.state.user.id, ...ctx.request.body },
      { include: [BusinessEmployee] }
    )
    ctx.body = { body: businessCanvas }
  }]
})

// update
router.route({
  method: 'put',
  path: '/:id',
  ...updateHelper,
  handler: [async (ctx) => {
    let businessCanvas = await findBusiness(ctx)
    // TODO
    const params = ctx.request.body
    params['location'] = JSON.stringify(params['location'])
    businessCanvas = await businessCanvas.update(params)
    ctx.body = { body: businessCanvas }
  }]
})

router.route({
  method: 'delete',
  path: '/:id',
  ...deleteHelper,
  handler: [async (ctx) => {
    console.log(ctx.params.id)
    const businessCanvas = await findBusiness(ctx)
    businessCanvas.update({deletedAt: new Date().toUTCString()})
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
    const businessCanvas = await findBusinessCanvas(ctx)
    ctx.body = { body: JSON.stringify(businessCanvas) }
  }]
})