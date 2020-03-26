import * as Router from 'koa-joi-router'
import * as fs from 'fs'
import log from '../config/log'

const koaSwagger = require('koa2-swagger-ui')
const { SwaggerAPI } = require('koa-joi-router-docs')

const generator = new SwaggerAPI()

const router = Router()
// const ext = __filename.substring(__filename.lastIndexOf('.'))

const loadRouter = (dir: string) => {
  const prefix = dir.replace(/^.*\/routers/, '')

  for (const file of fs.readdirSync(dir)) {
    const path = `${dir}/${file}` 
    try {
      if (fs.lstatSync(path).isDirectory()) {
        loadRouter(path)
        continue
      }

      const module = require(path)
      if (module.router) {
        const name = prefix + '/' + file.substring(0, file.lastIndexOf('.'))
        router.use(name, module.router.middleware())
        generator.addJoiRouter(module.router, { prefix: name })
      }
    } catch(err) {
      log.info('load router failed:', dir, file)
      log.info(err)
    }
  }
}
loadRouter(__dirname)

// for (const file of fs.readdirSync(__dirname)) {
//   console.log(file)
//   if (!file.startsWith('index') && file.endsWith(ext)) {
//     const module = require(`${__dirname}/${file}`)
//     const name = file.substring(0, file.lastIndexOf('.'))
//     if (module.router) {
//       router.use(`/${name}`, module.router.middleware())
//       generator.addJoiRouter(module.router, { prefix: `/${name}` })
//     } else if (Array.isArray(module.routers)) {
//       module.routers.forEach((sub_router: Router.Router) => {
//         router.use(`/${name}`, sub_router.middleware())
//         generator.addJoiRouter(sub_router, { prefix: `/${name}` + (sub_router.prefix || '') })
//       })
//     }
//   }
// }

const spec = generator.generateSpec({
  info: {
    title: 'Canvas Recruit API',
    description: 'API document of Canvas Recruit',
    version: '1.0.0'
  },
  basePath: '/',
  // // Add tags here
  // tags: [{
  //   name: 'users',
  //   description: `A User represents a person who can login 
  //     and take actions subject to their granted permissions.`
  // }],
}, { 
  defaultResponses: {} // Custom default responses if you don't like default 200
})

/**
 * Swagger JSON API
 */
router.get('/_api.json', async ctx => {
  ctx.body = JSON.stringify(spec, null, '')
})

router.get('/docs', koaSwagger({
  hideTopbar: true,
  swaggerOptions: {
    url: './_api.json'
  }
}))

export default router