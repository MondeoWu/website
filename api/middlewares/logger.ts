import * as Koa from 'koa'
import * as Boom from 'boom'
import log from '../config/log'

const boom = async (ctx: any, next: Function) => {
  try {
    await next()
  } catch (error) {
    if (Boom.isBoom(error)) {
      // TODO Handling special exceptions separately here.
      const boom = new Boom(error)
      if (boom.data) {
        // throw new Boom() from our business will put error info in boom.data
        ctx.status = boom.data.status || 500
        ctx.body = boom.data
      } else {
        // throw Boom.notFound() error info is in boom.output
        ctx.status = boom.output.statusCode || 500
        ctx.body = boom.output.payload
      }
      ctx._boom = boom
    } else {
      ctx.status = error.status || 500
      if (error.details) {
        ctx.body = { message: error.message, details: error.details.map(detail => detail.message), stack: error.stack }
      } else {
        ctx.body = { message: error.message, stack: error.stack }
      }
    }
    if (ctx._boom) {
      log.error(ctx._boom)
    } else {
      log.error(ctx.body.messages || ctx.body.message)
      log.error(ctx.body.stack)
    }
  }
}

const isTest = process.env.NODE_ENV === 'test'

const serializers = {
  ctx: (ctx: any, log_body = true) => {
    if (!ctx.header) {
      return ctx
    }
    const json: any = {
      method: ctx.method,
      path: ctx.path,
      query: redact(Object.assign({}, ctx.request.query)),
      status: ctx.status
    }
    if (log_body) {
      json.body = redact(Object.assign({}, ctx.request.body))
    } else {
      json.body = '[skipped]'
    }
    const account_manager = ctx.state && ctx.state.account_manager
    if (account_manager) {
      json.account_manager = account_manager.id
    }
    const person = ctx.state && ctx.state.person
    if (person) {
      json.person = person.id
    }
    const permalink = ctx.state && ctx.state.permalink
    if (permalink) {
      json.permalink = permalink.id
    }
    return json
  },
  ctx_received: (ctx: any) => {
    if (!ctx.header) {
      return ctx
    }

    const json: any = {
      method: ctx.method,
      url: ctx.url,
      query: redact(Object.assign({}, ctx.request.query)),
    }
    return json
  }
}

const redact = (payload: { [key: string]: any }) => {
  if (payload.password) {
    payload.password = '[redacted]'
  }
  if (payload.old_password) {
    payload.old_password = '[redacted]'
  }
  return payload
}

export default (): Koa.Middleware => {
  return async (ctx: any, next) => {
    const request_info = serializers.ctx_received(ctx)

    let allow_logging = true
    if (isTest || ctx.path === '/docs' || ctx.path === '/monitoring/health-check') {
      allow_logging = false
    }

    if (allow_logging) {
      log.info(`[rid=${ctx.state.id}] request received: ${request_info.method} ${request_info.url}`)
    }

    const startAt = process.hrtime()
    await boom(ctx, next)
    if (isTest) return
    if (ctx.path === '/docs') return
    if (ctx.statusCode === 404) return
    const diff = process.hrtime(startAt)
    const responseTime = Math.floor(diff[0] * 1e3 + diff[1] * 1e-6)

    if (allow_logging) {
      log.info(`[rid=${ctx.state.id}] request finished in ${responseTime}ms:
${JSON.stringify(serializers.ctx(ctx, true), null, 2)}`)
    }
  }
}