import { Joi, Config } from 'koa-joi-router'
import { compareSync } from 'bcrypt'
import constant from '../../config/constant'
import { User } from '../../db/models/User'
import * as jwt from 'jsonwebtoken'

const userOutput = {
  '200': {
    body: {
      token: Joi.string().required(),
      user: Joi.object()
    }
  }
}

// login
export const loginHelper: Config = {
  meta: {
    swagger: {
      summary: 'login with email',
      tags: ['User']
    }
  },
  validate: {
    type: 'json',
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().regex(constant.passwordRegExp)
    }),
    output: userOutput
  }
}

// Sign up
export const signUpHelper: Config = {
  meta: {
    swagger: {
      summary: 'Sign up with email',
      tags: ['User']
    }
  },
  validate: {
    type: 'json',
    body: Joi.object({
      email: Joi.string(),
      password: Joi.string(),
      userProfile: Joi.object({
        userRoleId: Joi.number().required(),
        permitStatusId: Joi.number().optional(),
        programId: Joi.number().optional(),
        employStatusId: Joi.number().optional()
      }).required(),
      userCategories: Joi.array().items(Joi.object({
        categoryId: Joi.number(),
        licenseNo: Joi.string().optional()
      })).optional(),
      socialAccount: Joi.object({
        platform: Joi.string(),
        uuid: Joi.string(),
        email: Joi.string(),
        name: Joi.string(),
        image: Joi.string()
      }).optional()
    }),
    output: userOutput
  }
}

export function verifyPassword(pwd: string, hash: string): boolean {
  hash = hash.replace(constant.bcryptPrefixPhp, constant.bcryptPrefixNode)
  return compareSync(pwd, hash)
}

export function respBody(user: User): { [id: string] : any } {
  return {
    token: jwt.sign({id: user.id}, process.env.JWT_SECRET),
    user: JSON.stringify(user)
  }
}