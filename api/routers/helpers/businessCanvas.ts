import { Joi, Config } from 'koa-joi-router'
import { BusinessCanvas } from '../../db/models/BusinessCanvas'
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

 // create company info
export const createHelper: Config = {
  meta: {
    swagger: {
      summary: 'Create company information',
      tags: ['BusinessCanvas']
    }
  },
  validate: _validate
}

// business canvas
export const updateHelper: Config = {
  meta: {
    swagger: {
      summary: 'Edit company canvas',
      tags: ['BusinessCanvas']
    }
  },
  validate: {
    type: 'json',
    body: Joi.object({
      headline: Joi.string().required(),
      description: Joi.string().required(),
      logo: Joi.string().required(),
      featuredPhoto: Joi.string().required(),
      teamPhoto: Joi.string().required(),
      featuredVideo: Joi.array().required(),
      paymentPreference: Joi.string().required(),
      companyBenefits: Joi.string().required(),
      socialMedia: Joi.object().required(),
      ..._body
    }),
    output: {
      '200': {
        body: Joi.object()
      }
    }
  }
}

// delete
export const deleteHelper: Config = {
  meta: {
    swagger: {
      summary: 'Delete business canvas',
      tags: ['BusinessCanvas']
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
      summary: 'Show Business canvas',
      tags: ['BusinessCanvas']
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
      tags: ['BusinessCanvas']
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
export const findBusinessCanvas = async (ctx: Context): Promise<BusinessCanvas> => {
  const businessCanvas = await BusinessCanvas.findOne({
    where: {id: ctx.params.id, userID: ctx.state.user.id},
    attributes: _columns
  })
  if (!businessCanvas) throw Boom.notFound
  return businessCanvas
}