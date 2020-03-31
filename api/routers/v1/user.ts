import * as Router from 'koa-joi-router'
import * as Boom from 'boom'
import log from '../../config/log'
import { User } from '../../db/models/User'
import { loginHelper, signUpHelper, verifyPassword, respBody } from '../helpers/user'

export const router = Router()

router.route({
  method: 'post',
  path: '/login',
  ...loginHelper,
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
  ...signUpHelper,
  handler: [async (ctx) => {
    const { email, password } = ctx.request.body
    log.info('[sign up] email:', email)
    const user = await User.create({email, password, name: ''})
    ctx.body = respBody(user)
  }]
})