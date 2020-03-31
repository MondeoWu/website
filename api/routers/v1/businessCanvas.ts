import * as Router from 'koa-joi-router'
import { createHelper, updateHelper, deleteHelper, showHelper, findBusinessCanvas, formatParams } from '../helpers/businessCanvas'
import { BusinessCanvas } from '../../db/models/BusinessCanvas'
import { BusinessCanvasEmployee } from '../../db/models/BusinessCanvasEmployee'

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
    ctx.body = {
      body: {
        id: businessCanvas.id,
        done: true
      }
    }
  }]
})

// update
router.route({
  method: 'put',
  path: '/:id',
  ...updateHelper,
  handler: [async (ctx) => {
    const businessCanvas = await findBusinessCanvas(ctx)
    const userIds = businessCanvas.employees.map(e => e.userId)
    const _employees = ctx.request.body.employees
    const params = formatParams(ctx.request.body)

    await BusinessCanvas.sequelize.transaction(async (transaction) => {
      await businessCanvas.update(params, {transaction})

      for (const employee of (_employees || [])) {
        // id is blank, create a new record
        if (!employee.id && !userIds.includes(employee.userId)) {
          await BusinessCanvasEmployee.create({userId: employee.userId, businessCanvasId: businessCanvas.id}, {transaction})
          continue
        }
        // _delete is true, destroy the record
        if (employee._destroy && employee.id) {
          await BusinessCanvasEmployee.destroy({
            where: {
              id: employee.id,
              businessCanvasId: businessCanvas.id
            },
            transaction
          })
        }
      }
    })

    ctx.body = {
      body: {
        id: businessCanvas.id,
        done: true
      }
    }
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

// show business canvas detail
router.route({
  method: 'get',
  path: '/:id',
  ...showHelper,
  handler: [async (ctx) => {
    const businessCanvas = await findBusinessCanvas(ctx)
    ctx.body = { body: JSON.stringify(businessCanvas) }
  }]
})