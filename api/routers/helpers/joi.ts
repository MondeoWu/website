import { Joi } from 'koa-joi-router'

export const OptionalStringType = Joi.string().allow(null, '').optional()
export const OptionalNumberType = Joi.number().allow(null).optional()