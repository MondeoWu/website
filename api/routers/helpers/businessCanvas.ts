import { Joi, Config } from 'koa-joi-router'
import { BusinessCanvas } from '../../db/models/BusinessCanvas'
import { Context } from 'koa'
import Boom from 'boom'
import { BusinessCanvasEmployee } from '../../db/models/BusinessCanvasEmployee'

const _employee = {
  id: Joi.number().required(),
  userId: Joi.number().required(),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  photo: Joi.string().allow(null, '').optional(),
  _destroy: Joi.boolean().allow(null).optional()
}

const _body = {
  companyName: Joi.string().required(),
  primaryContactNumber: Joi.string().required(),
  businessCategoryID: Joi.string().required(),
  numberOfEmployee: Joi.string().required(),
  numberOfChairs: Joi.string().required(),
  squareFootage: Joi.string().required(),
  location: Joi.array().items(Joi.string()).required(),
  employees: Joi.array().items(Joi.object(_employee)).optional()
}

const _bodyAdditional = {
  headline: Joi.string().optional(),
  description: Joi.string().optional(),

  logo: Joi.string().optional(),
  featuredPhoto: Joi.string().optional(),
  teamPhoto: Joi.string().optional(),
  featuredVideo: Joi.array().items(Joi.string()).optional(),

  awardsAndAchievements: Joi.array().items(Joi.object({
    title: Joi.string().required(),
    issuer: Joi.string().required(),
    issueYear: Joi.string().required()
  })).optional(),

  retailBrands: Joi.array().items(Joi.number()).optional(),
  softwareUsed: Joi.array().items(Joi.number()).optional(),
  backbarBrands: Joi.array().items(Joi.number()).optional(),
  specialties: Joi.array().items(Joi.number()).optional(),
  paymentPreference: Joi.number().optional(),
  benefits: Joi.array().items(Joi.number()).optional(),

  facebookUrl: Joi.string().optional(),
  linkedinUrl: Joi.string().optional(),
  twitterUrl: Joi.string().optional(),
  instagramUrl: Joi.string().optional(),
}

const _bodyOther = {
  id: Joi.number().optional(),
  userId: Joi.number().optional(),
  deletedAt: Joi.any(),
  createdAt: Joi.any(),
  updatedAt: Joi.any()
}

const _validate: Config['validate'] = {
  type: 'json',
  body: Joi.object(_body),
  output: {
    '200': {
      body: {
        body: Joi.object({
          ..._body,
          ..._bodyAdditional,
          ..._bodyOther
        })
      }
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
    body: Joi.object(),
    output: {
      '200': {
        body: {
          body: Joi.object({
            ..._body,
            ..._bodyAdditional,
            ..._bodyOther
          })
        }
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
            ..._bodyAdditional,
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
          body: Joi.array().items(Joi.object(_employee))
        }
      }
    }
  }
}

const _columns = ['id', 'companyName', 'primaryContactNumber', 'businessCategoryID', 'numberOfEmployee', 'numberOfChairs', 'squareFootage', 'location']
export const findBusinessCanvas = async (ctx: Context): Promise<BusinessCanvas> => {
  const businessCanvas = await BusinessCanvas.findOne({
    where: {id: ctx.params.id, userId: ctx.state.user.id},
    // attributes: _columns,
    include: [{model: BusinessCanvasEmployee, attributes: ['id', 'userId', 'name', 'photo']}]
  })
  if (!businessCanvas) throw Boom.notFound()
  return businessCanvas
}

// format params
const _params = ['location', 'featuredVideo', 'retailBrands', 'softwareUsed', 'backbarBrands', 'specialties', 'benefits', 'awardsAndAchievements']
export const formatParams = (params: {}): {} => {
  for (const p of _params) {
    if (!params[p]) continue

    params[p] = JSON.stringify(params[p])
  }
  return params
}