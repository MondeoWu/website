import logger from './logger'
import routers from '../routers'
import * as jwt from 'koa-jwt'
import constants from '../config/constant'
import * as cors from 'kcors'

export const useMidlewares = (app) => {
    app.use(
        cors({
          maxAge: 86400,
        })
      )
    app.use(logger())
    app.use(jwt({ secret: process.env.JWT_SECRET }).unless({ path:  constants.publicApis }))
    app.use(routers.middleware())
}