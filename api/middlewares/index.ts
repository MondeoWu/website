import logger from './logger'
import routers from '../routers'
import * as jwt from 'koa-jwt'
import constants from '../config/constant'

export const useMidlewares = (app) => {
    app.use(logger())
    app.use(jwt({ secret: process.env.JWT_SECRET }).unless({ path:  constants.publicApis }))
    app.use(routers.middleware())
}