import { Joi, Config } from 'koa-joi-router'

export const createHelper: Config = {
  meta: {
    swagger: {
      summary: 'Create a business',
      tags: ['Business']
    }
  },
  validate: {
    type: 'json',
    body: Joi.object({
      companyName: Joi.string().required(),
      primaryContactNumber: Joi.string().required(),
      businessCategoryID: Joi.string().required(),
      numberOfEmployee: Joi.string().required(),
      numberOfChairs: Joi.string().required(),
      squareFootage: Joi.string().required()
    }),
    output: {
      '200': {
        body: Joi.object()
      }
    }
  }
}