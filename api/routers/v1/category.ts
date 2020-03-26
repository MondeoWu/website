import * as Router from 'koa-joi-router'
import { Joi } from 'koa-joi-router'
import { Category } from '../../db/models/Category'

export const router = Router()

router.route({
  method: 'get',
  path: '/',
  meta: {
    swagger: {
      summary: 'List all categories',
      tags: ['Category']
    }
  },
  validate: {
    output: {
      '200': {
        body: Joi.array().items(Joi.object({
          id: Joi.number().required(),
          name: Joi.string().required(),
        }))
      }
    }
  },
  handler: [async (ctx) => {
    const categories = await Category.findAll({attributes: ['id', 'name']})
    ctx.body = JSON.stringify(categories)
  }]
})