import { Joi, Config } from 'koa-joi-router'
import { BusinessCanvas } from '../../db/models/BusinessCanvas'
import { Context } from 'koa'
import * as Boom from 'boom'
import { BusinessCanvasEmployee } from '../../db/models/BusinessCanvasEmployee'
import { Category } from '../../db/models/Category'
import { PaymentReference } from '../../db/models/PaymentReference'
import { Includeable } from 'sequelize/types'
import { OptionaStringType, OptionalNumberType } from '../helpers/joi'

const _body = {
  companyName: Joi.string().required(),
  primaryContactNumber: Joi.string().required(),
  businessCategoryId: Joi.number().required(),
  numberOfEmployee: Joi.number().required(),
  numberOfChairs: Joi.number().required(),
  squareFootage: Joi.number().required(),
  location: Joi.array().items(Joi.string()).required()
}

const _output = {
  '200': {
    body: {
      body: Joi.object({
        id: Joi.number().required(),
        done: Joi.boolean().required()
      })
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
  validate: {
    type: 'json',
    body: Joi.object({
      ..._body,
      employees: Joi.array().items(Joi.object({
        userId: Joi.number().required()
      })).optional()
    }),
    output: _output
  }
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
      ..._body,
      
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
      paymentPreferenceId: Joi.number().optional(),
      benefits: Joi.array().items(Joi.number()).optional(),

      facebookUrl: Joi.string().optional(),
      linkedinUrl: Joi.string().optional(),
      twitterUrl: Joi.string().optional(),
      instagramUrl: Joi.string().optional(),

      employees: Joi.array().items(Joi.object({
        id: Joi.number().optional(),
        userId: Joi.number().required(),
        _destroy: Joi.boolean().optional()
      })).optional()
    }),
    output: _output
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
          body: {
            body: Joi.object({
              done: Joi.boolean().required()
            })
          }
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
            id: Joi.number(),
            userId: OptionalNumberType,
            companyName: OptionaStringType,
            primaryContactNumber: OptionaStringType,
            businessCategoryId: OptionalNumberType,
            numberOfEmployee: OptionalNumberType,
            numberOfChairs: OptionalNumberType,
            squareFootage: OptionalNumberType,
            location: Joi.array().items(OptionaStringType).required(),
            headline: OptionaStringType,
            description: OptionaStringType,
            logo: OptionaStringType,
            featuredPhoto: OptionaStringType,
            teamPhoto: OptionaStringType,
            featuredVideo: Joi.array().items(OptionaStringType).allow(null, '').optional(),
            retailBrands: Joi.array().items(Joi.object({id: OptionalNumberType, name: OptionaStringType})).allow(null, '').optional(),
            softwareUsed: Joi.array().items(Joi.object({id: OptionalNumberType, name: OptionaStringType})).allow(null, '').optional(),
            backbarBrands: Joi.array().items(Joi.object({id: OptionalNumberType, name: OptionaStringType})).allow(null, '').optional(),
            specialties: Joi.array().items(Joi.object({id: OptionalNumberType, name: OptionaStringType})).allow(null, '').optional(),
            benefits: Joi.array().items(Joi.object({id: OptionalNumberType, name: OptionaStringType})).allow(null, '').optional(),
            paymentPreferenceId: OptionalNumberType,
            facebookUrl: OptionaStringType,
            linkedinUrl: OptionaStringType,
            twitterUrl: OptionaStringType,
            instagramUrl: OptionaStringType,
            awardsAndAchievements: Joi.array().items(Joi.object({
              title: OptionaStringType,
              issuer: OptionaStringType,
              issueYear: OptionaStringType
            })).allow(null).optional(),
            employees: Joi.array().items(Joi.object({
              id: OptionalNumberType,
              userId: OptionalNumberType,
              name: OptionaStringType,
              photo: OptionaStringType
            })).allow(null).optional(),
            businessCategory: Joi.object({
              id: OptionalNumberType,
              name: OptionaStringType,
              kind: OptionalNumberType
            }).allow(null).optional(),
            paymentPreference:  Joi.object({
              id: OptionalNumberType,
              name: OptionaStringType
            }).allow(null).optional(),
            deletedAt: Joi.any(),
            createdAt: Joi.any(),
            updatedAt: Joi.any()
          }
        }
      }
    }
  }
}

// publish
export const publishHelper: Config = {
  meta: {
    swagger: {
      summary: 'publish canvas',
      tags: ['BusinessCanvas']
    }
  }
}

// const _columns = ['id', 'companyName', 'primaryContactNumber', 'businessCategoryId', 'numberOfEmployee', 'numberOfChairs', 'squareFootage', 'location']
export const findBusinessCanvas = async (ctx: Context, isEager: boolean = false): Promise<BusinessCanvas> => {
  let associations: Includeable[] = [{model: BusinessCanvasEmployee, attributes: ['id', 'userId', 'name', 'photo']}]
  if (isEager) associations = associations.concat([
    {model: Category, attributes: ['id', 'name', 'kind']},
    {model: PaymentReference, attributes: ['id', 'name']},
  ])
  const businessCanvas = await BusinessCanvas.findOne({
    where: {id: ctx.params.id, userId: ctx.state.user.id},
    // attributes: _columns,
    include: associations
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