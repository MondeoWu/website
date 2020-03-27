import { Joi, Config } from 'koa-joi-router'
import { Business } from '../../db/models/Business'
import { Context } from 'koa'
import Boom from 'boom'

const _body = {
  companyName: Joi.string().required(),
  primaryContactNumber: Joi.string().required(),
  businessCategoryID: Joi.string().required(),
  numberOfEmployee: Joi.string().required(),
  numberOfChairs: Joi.string().required(),
  squareFootage: Joi.string().required(),
  location: Joi.array().required(),
  employees: Joi.array().items(Joi.object({
    userID: Joi.number().required(),
    name: Joi.string().optional(),
    instagramUsername: Joi.string().optional()
  }))
}
const _validate: Config['validate'] = {
  type: 'json',
  body: Joi.object(_body),
  output: {
    '200': {
      body: Joi.object()
    }
  }
}
 // create 
export const createHelper: Config = {
  meta: {
    swagger: {
      summary: 'Create business',
      tags: ['Business']
    }
  },
  validate: _validate
}

// update
export const updateHelper: Config = {
  meta: {
    swagger: {
      summary: 'Update business',
      tags: ['Business']
    }
  },
  validate: _validate
}

// delete
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

// show
export const showHelper: Config = {
  meta: {
    swagger: {
      summary: 'Show business',
      tags: ['Business']
    }
  },
  validate: {
    output: {
      '200': {
        body: {
          body: {
            ..._body,
            id: Joi.number().required()
          }
        }
      }
    }
  }
}

// employee search
export const employeeHelper: Config = {
  meta: {
    swagger: {
      summary: 'Search employee by email or name',
      tags: ['Business']
    }
  },
  validate: {
    query: {
      q: Joi.string().required()
    },
    output: {
      '200': {
        body: {
          body: Joi.array().items(Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            email: Joi.string().required(),
            profilePhoto: Joi.string().required()
          }))
        }
      }
    }
  }
}

const _columns = ['id', 'companyName', 'primaryContactNumber', 'businessCategoryID', 'numberOfEmployee', 'numberOfChairs', 'squareFootage', 'location']
export const findBusiness = async (ctx: Context): Promise<Business> => {
  const business = await Business.findOne({
    where: {id: ctx.params.id, userID: ctx.state.user.id},
    attributes: _columns
  })
  if (!business) throw Boom.notFound
  return business
}