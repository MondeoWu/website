import { Joi, Config } from 'koa-joi-router'
import { compareSync } from 'bcrypt'
import constant from '../../config/constant'
import { User } from '../../db/models/User'
import * as jwt from 'jsonwebtoken'

const userBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().regex(constant.passwordRegExp)
})
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
    body: userBody,
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
    body: userBody,
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