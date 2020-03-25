import * as Router from 'koa-joi-router'
import * as Boom from 'boom'
import * as jwt from 'jsonwebtoken'
import log from '../config/log'
import { User } from '../db/models/User'
import { login, signUp, verifyPassword, respBody } from './helpers/user'

export const router = Router()

router.route({
  method: 'get',
  path: '/info',
  handler: [async (ctx) => {
    ctx.body = await User.findOne({where: {id: ctx.state.user.id}})
  }]
})

router.route({
  method: 'post',
  path: '/login',
  meta: login.meta,
  validate: login.validate,
  handler: [async (ctx) => {
    const {email, password} = ctx.request.body
    log.info('[Login] email:', email)
    const user = await User.findOne({where: {email}})
    if (!user) throw Boom.unauthorized('wrong email')
    if (!verifyPassword(password, user.password)) throw Boom.unauthorized('wrong password')
    ctx.body = respBody(user)
  }]
  
})

router.route({
  method: 'post',
  path: '/sign-up',
  meta: signUp.meta,
  validate: signUp.validate,
  handler: [async (ctx) => {
    const { email, password } = ctx.request.body
    log.info('[sign up] email:', email)
    const user = await User.create({email, password, name: ''})
    ctx.body = respBody(user)
  }]
})