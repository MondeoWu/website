import { Joi, Config } from 'koa-joi-router'
import { Business } from '../../db/models/Business'
import Boom from 'boom'

const _validate: Config['validate'] = {
  type: 'json',
  body: Joi.object({
    companyName: Joi.string().required(),
    primaryContactNumber: Joi.string().required(),
    businessCategoryID: Joi.string().required(),
    numberOfEmployee: Joi.string().required(),
    numberOfChairs: Joi.string().required(),
    squareFootage: Joi.string().required(),
    location: Joi.array().required()
  }),
  output: {
    '200': {
      body: Joi.object()
    }
  }
}

export const createHelper: Config = {
  meta: {
    swagger: {
      summary: 'Create business',
      tags: ['Business']
    }
  },
  validate: _validate
}

export const updateHelper: Config = {
  meta: {
    swagger: {
      summary: 'Update business',
      tags: ['Business']
    }
  },
  validate: _validate
}

export const deleteHelper: Config = {
  meta: {
    swagger: {
      summary: 'Delete business',
      tags: ['Business']
    }
  },
  validate: {
    output: {
      '200': {
        body: {
          body: Joi.boolean().required()
        }
      }
    }
  }
}

export const findBusiness = async (id: number): Promise<Business> => {
  const business = await Business.findOne({where: {id}})
  if (!business) throw Boom.notFound
  return business
}