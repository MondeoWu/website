import * as Router from 'koa-joi-router'
import { Joi } from 'koa-joi-router'
import { User } from '../../db/models/User'
import { Brand } from '../../db/models/Brand'
import { BusinessCanvasEmployee } from '../../db/models/BusinessCanvasEmployee'
import { CompanyBenefit } from '../../db/models/CompanyBenefit'
import { Software } from '../../db/models/Software'
import { Speciality } from '../../db/models/Speciality'
import { PaymentReference } from '../../db/models/PaymentReference'
import { Category } from '../../db/models/Category'
import { UserRole } from '../../db/models/UserRole'
import { PermitStatus } from '../../db/models/PermitStatus'
import { Program } from '../../db/models/Program'
import { EmployStatus } from '../../db/models/EmployStatus'


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
  {name: 'company-benefit', kls: CompanyBenefit, table: 'company_benefits'},         // Company benefits,
  {name: 'user-role', kls: UserRole, table: 'user_roles'}, // user roles
  {name: 'permit-status', kls: PermitStatus, table: 'permit_status'}, // permit
  {name: 'program', kls: Program, table: 'programs'}, // program
  {name: 'employ-status', kls: EmployStatus, table: 'employ_status'}, // employ status
]
for (const r of optionRouters) {
  router.route({
    method: 'get',
    path: '/' + r.name,
    meta: {
      swagger: {
        summary: `List ${r.name}`,
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
      const _model: any = r.kls
      const res = await _model.scope('active').findAll({ attributes: ['id', 'name'] })
      ctx.body = {
        body: JSON.stringify(res)
      }
    }]
  })
}

// get categories
router.route({
  method: 'get',
  path: '/category',
  meta: {
    swagger: {
      summary: 'List all categories',
      tags: ['CanvasOptions']
    }
  },
  validate: {
    query: {
      q: Joi.string().optional()
    },
    output: {
      '200': {
        body: {
          body: Joi.array().items(Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
          }))
        }
      }
    }
  },
  handler: [async (ctx) => {
    // when query string is blank, return all system categories
    let categories: Category[] = null
    if (!ctx.query.q) {
      categories = await Category.scope('official').scope('active').findAll({attributes: ['id', 'name']})
    } else {
      categories = await Category.sequelize.query(
        'SELECT id, name FROM categories WHERE deleted_at IS NULL AND LOWER(name) LIKE ?',
        {
          replacements: [`%${ctx.query.q.toLowerCase()}%`],
          model: Category,
          mapToModel: true
        }
      )
    }
    ctx.body = {
      body: JSON.stringify(categories)
    }
  }]
})

// create custom categories
router.route({
  method: 'post',
  path: '/category',
  meta: {
    swagger: {
      summary: 'Create custom categories',
      tags: ['CanvasOptions']
    }
  },
  validate: {
    type: 'json',
    body: Joi.object({
      name: Joi.string().required()
    }),
    output: {
      '200': {
        body: {
          body: {
            id: Joi.number().required(),
            done: Joi.boolean().required()
          }
        }
      }
    }
  },
  handler: [async (ctx) => {
    const { name } = ctx.request.body
    const params = {name, kind: 1}
    
    let category = await Category.scope('active').findOne({
      where: params,
      attributes: ['id']
    })
    if (!category) category = await Category.create(params)

    console.log(category)
    ctx.body = {
      body: {
        id: category.id,
        done: true
      }
    }
  }]
})