import * as Router from 'koa-joi-router'
import { Joi } from 'koa-joi-router'
import google from '../../oauth2/google'
import GoogleOauth2 from '../../oauth2/google'

export const router = Router()

// consent urls
router.route({
  method: 'get',
  path: '/urls',
  meta: {
    swagger: {
      summary: 'Get oauth2 consent urls',
      tags: ['Oauth2']
    }
  },
  validate: {
    output: {
      '200': {
        body: Joi.array().items(Joi.object({
          name: Joi.string(),
          url: Joi.string()
        }))
      }
    }
  },
  handler: [async (ctx) => {
    ctx.body = [{
      name: 'google',
      url: google.consentUrl()
    }]
  }]
})

// callback
router.route({
  method: 'get',
  path: '/consent-callback',
  handler: [async (ctx) => {
    // const go = new GoogleOauth2(ctx.query.code)
    // await go.getToken()
    
    // ctx.status = 301
    // ctx.redirect(`https://baidu.com?sub=${go.getSub()}`)
    console.log(ctx)
    ctx.body = 200
  }]
})