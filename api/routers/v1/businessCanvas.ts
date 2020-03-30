import * as Router from 'koa-joi-router'
import { createHelper, updateHelper, deleteHelper, showHelper, employeeHelper, findBusinessCanvas, formatParams } from '../helpers/businessCanvas'
import { BusinessCanvas } from '../../db/models/BusinessCanvas'
import { User } from '../../db/models/User'
import { BusinessCanvasEmployee } from '../../db/models/BusinessCanvasEmployee'
import Boom from 'boom'

export const router = Router()

// create
router.route({
  method: 'post',
  path: '/',
  ...createHelper,
  handler: [async (ctx) => {
    const params = formatParams(ctx.request.body)
    const businessCanvas = await BusinessCanvas.create(
      { userId: ctx.state.user.id, ...params },
      { include: [BusinessCanvasEmployee] }
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
    let businessCanvas = await findBusinessCanvas(ctx)
    const params = formatParams(ctx.request.body)
    await BusinessCanvas.sequelize.transaction(async (transaction) => {
      businessCanvas = await businessCanvas.update(params, {transaction})
      const userIds = (await BusinessCanvasEmployee.findAll({where: {businessCanvasId: businessCanvas.id}})).map(e => e.userId)

      for (const employee of businessCanvas.employees) {
        // id is blank, create a new record
        if (!employee.id && !userIds.includes(employee.userId)) {
          await BusinessCanvasEmployee.create({userId: employee.userId, businessCanvasId: businessCanvas.id}, {transaction})
          continue
        }
        // _delete is true, destroy the record
        if (employee._delete) {
          await employee.destroy({transaction})
        }
      }
    })

    const res = JSON.stringify(await findBusinessCanvas(ctx))
    ctx.body = { body: res }
  }]
})

// delete
router.route({
  method: 'delete',
  path: '/:id',
  ...deleteHelper,
  handler: [async (ctx) => {
    console.log(ctx.params.id)
    const businessCanvas = await findBusinessCanvas(ctx)
    businessCanvas.update({deletedAt: new Date().toUTCString()})
    ctx.body = { body: true }
  }]
})

// search employee by email or name
router.route({
  method: 'get',
  path: '/employee',
  ...employeeHelper,
  handler: [async (ctx) => {
    const res = await User.sequelize.query(
      ` SELECT u.id, u.name, u.email, up.profile_image profilePhoto
        FROM users u
        LEFT JOIN user_profiles up ON up.user_id=u.id
        WHERE u.name LIKE :query OR u.email LIKE :query
        ORDER BY u.name ASC`,
      { replacements: { query: `%${ctx.query.q.toLowerCase()}%` }}
    )
    ctx.body = { body: JSON.stringify(res[0]) }
  }]
})

// get business employee detail
router.route({
  method: 'get',
  path: '/:id',
  ...showHelper,
  handler: [async (ctx) => {
    const businessCanvas = await findBusinessCanvas(ctx)
    ctx.body = { body: JSON.stringify(businessCanvas) }
  }]
})