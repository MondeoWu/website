import './config'
import * as Koa from 'koa'
import { useMidlewares } from './middlewares'
import sequelize from './db/database'

sequelize.sync().then(() => {
  const port = process.env.PORT || 3333
  const app = new Koa()
  useMidlewares(app)
  app.listen(port, () => {
    console.log(`app.listen(${port})`)
  })
})
