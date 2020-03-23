import * as Koa from 'koa'
import { logger } from './middlewares'
import sequelize from './db/database'
import routers from './routers'
import { User } from './db/models/User'

sequelize.sync().then(() => {
  const app = new Koa()
  const port = process.env.PORT || 3333
  app.use(logger())
  app.use(routers.middleware())
  app.listen(port, () => {
    console.log(`app.listen(${port})`)
  })
})
