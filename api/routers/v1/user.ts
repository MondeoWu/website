import * as Router from 'koa-joi-router'
import * as Boom from 'boom'
import log from '../../config/log'
import { User } from '../../db/models/User'
import { loginHelper, signUpHelper, verifyPassword, respBody } from '../helpers/user'
import { UserProfile } from '../../db/models/UserProfile'
import { SocialAccount } from '../../db/models/SocialAccount'
import { PermitStatus } from '../../db/models/PermitStatus'
import { UserRole } from '../../db/models/UserRole'
import { Program } from '../../db/models/Program'
import { EmployStatus } from '../../db/models/EmployStatus'
import { UserCategory } from '../../db/models/UserCategory'
import { Category } from '../../db/models/Category'
import { JobTitle } from '../../db/models/JobTitle'
import { updateHelper } from '../helpers/user'
import { UserJobTitle } from '../../db/models/UserJobTitle'

export const router = Router()

router.route({
  method: 'get',
  path: '/info/:id',
  handler: [async (ctx) => {
    const user = await User.findOne({
      where: {id: ctx.params.id},
      include: [
        { model: UserProfile, include: [
          {model: PermitStatus, attributes: ['id', 'name']},
          {model: UserRole, attributes: ['id', 'name']},
          {model: PermitStatus, attributes: ['id', 'name']},
          {model: Program, attributes: ['id', 'name']},
          {model: EmployStatus, attributes: ['id', 'name']},
        ]}, 
        { model: SocialAccount, attributes: ['id', 'uuid'] },
        { model: UserCategory, attributes: ['licenseNo'], include: [
          { model: Category, attributes: ['id', 'name'] }
        ]},
        { model: JobTitle, attributes: ['id', 'name'] }
      ]
    })
    ctx.body = user
  }]
})

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

// sign up
router.route({
  method: 'post',
  path: '/sign-up',
  ...signUpHelper,
  handler: [async (ctx) => {
    const { email, password, userProfile, socialAccount, userCategories } = ctx.request.body

    if (await User.findOne({where: {email}, attributes: ['id']}))
      throw Boom.badData('Email has been registered')

    if (socialAccount && await SocialAccount.findOne({where: {platform: socialAccount.platform, uuid: socialAccount.uuid}}))
      throw Boom.badData('Social Account has been registered')

    const params = { email, password, name: '', userProfile }
    if (socialAccount)
      params['socialAccounts'] = [socialAccount]
    if (userCategories)
      params['userCategories'] = userCategories
    
    const user = await User.sequelize.transaction(async (transaction) => {
      return await User.create(
        params, {
          include: [UserProfile, SocialAccount, UserCategory],
          transaction
        }
      )
    })
    ctx.body = respBody(user)
  }]
})

router.route({
  method: 'put',
  ...updateHelper,
  path: '/',
  handler: [async ctx => {
    const userId = ctx.state.user.id
    User.sequelize.transaction(async (transaction) => {
      const userProfile = await UserProfile.findOne({where: {userId: userId}})
      await userProfile.update(ctx.request.body.userProfile, {transaction})
      await UserJobTitle.create({userId, jobTitleId: ctx.request.body.jobTitleId}, {transaction})
    })

    ctx.body = {
      body: {
        id: userId,
        done: true
      }
    }
  }]
})