import * as Router from 'koa-joi-router'
import { Joi, Config } from 'koa-joi-router'
import { User } from '../../db/models/User'
import { Brand } from '../../db/models/Brand'
import { BusinessCanvasEmployee } from '../../db/models/BusinessCanvasEmployee'
import { CompanyBenefit } from '../../db/models/CompanyBenefit'
import { Software } from '../../db/models/Software'
import { Speciality } from '../../db/models/Speciality'
import { PaymentReference } from '../../db/models/PaymentReference'

export const router = Router()

/* ---------------- businessCanvas options ---------------- */

// search employee by email or name
router.route({
  method: 'get',
  path: '/employee',
  meta: {
    swagger: {
      summary: 'Search employees by name or email',
      tags: ['CanvasOptions']
    }
  },
  validate: {
    query: {
      q: Joi.string().required()
    },
    output: {
      '200': {
        body: {
          body: Joi.array().items(Joi.object({
            id: Joi.number().optional(),
            name: Joi.string().optional(),
            email: Joi.string().optional(),
            photo: Joi.string().allow(null, '').optional(),
          }))
        }
      }
    }
  },
  handler: [async (ctx) => {
    const employees = await User.sequelize.query(
      ` SELECT u.id, u.name, u.email, up.profile_image photo
        FROM users u
        LEFT JOIN user_profiles up ON up.user_id=u.id
        WHERE LOWER(u.name) LIKE :query OR LOWER(u.email) LIKE :query
        ORDER BY u.name ASC`,
      {
        replacements: { query: `%${ctx.query.q.toLowerCase()}%` },
        model: BusinessCanvasEmployee,
        mapToModel: true
      }
    )
    ctx.body = { body: JSON.stringify(employees) }
  }]
})

const optionRouters = [
  {name: 'brand', kls: Brand, table: 'brands'},                   // Backbar brands & Retail brands
  {name: 'software', kls: Software, table: 'softwares'},          // Software you use
  {name: 'speciality', kls: Speciality, table: 'specialities'},   // Specialties
  {name: 'payment-reference', kls: PaymentReference, table: 'payment_references'},  // Payment Preference
  {name: 'company-benefit', kls: CompanyBenefit, table: 'company_benefits'}         // Company benefits
]
for (const r of optionRouters) {
  router.route({
    method: 'get',
    path: '/' + r.name,
    meta: {
      swagger: {
        summary: `Search ${r.name} by name`,
        tags: ['CanvasOptions']
      }
    },
    validate: {
      output: {
        '200': {
          body: {
            body: Joi.array().items(Joi.object({
              id: Joi.number().optional(),
              name: Joi.string().optional(),
            }))
          }
        }
      }
    },
    handler: [async (ctx) => {
      const res = await Brand.sequelize.query(
        `SELECT id, name FROM ${r.table} WHERE deleted_at IS NULL`,
        // `SELECT id, name FROM ${r.table} WHERE deleted_at IS NULL AND LOWER(name) LIKE ?`,
        { 
          replacements: [`%${ctx.query.q.toLowerCase()}%`],
          model: r.kls,
          mapToModel: true
        }
      )
      ctx.body = {
        body: JSON.stringify(res)
      }
    }]
  })
}