import * as Router from 'koa-joi-router'
import * as Boom from 'boom'
import * as jwt from 'jsonwebtoken'
import { User } from '../db/models/User'
import { Joi } from 'koa-joi-router'
import log from '../config/log'

export const router = Router()

router.route({
  method: 'get',
  path: '/info',
  meta: {
    swagger: {
      summary: 'Info',
      tags: ['User']
    }
  },
  handler: [async (ctx) => {
    ctx.body = await User.findOne({where: {id: ctx.state.user.id}})
  }]
})

router.route({
  method: 'post',
  path: '/login',
  meta: {
    swagger: {
      summary: 'Login',
      tags: ['User']
    }
  },
  validate: {
    type: 'json',
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),
    output: {
      '200': {
        body: {
          token: Joi.string().required(),
          user: Joi.object()
        }
      }
    }
  },
  handler: [async (ctx) => {
    const {email, password} = ctx.request.body
    log.info('[Login] email:', email)
    const user = await User.findOne({where: {email}})
    if (!user) throw Boom.unauthorized('wrong email')
    if (!(await verifyPassword(password, user.password))) throw Boom.unauthorized('wrong password')
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET)
    ctx.body = { token, user: JSON.stringify(user) }
  }]
  
})

async function verifyPassword(pwd: String, hash: string): Promise<boolean> {
  var bcrypt = require('bcrypt')
  hash = hash.replace(/^\$2y(.+)$/i, '$2a$1')
  return await bcrypt.compare(pwd, hash)
}