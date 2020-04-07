import './config'
import * as Koa from 'koa'
import { useMidlewares } from './middlewares'
import sequelize from './db/database'
import * as cors from 'kcors'

sequelize.sync().then(() => {
  const port = process.env.PORT || 3333
  const app = new Koa()
  app.use(
    cors({
      maxAge: 86400
    })
  )
  useMidlewares(app)
  app.listen(port, () => {
    console.log(`app.listen(${port})`)
  })
})
