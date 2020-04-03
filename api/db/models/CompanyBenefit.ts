import { Table } from 'sequelize-typescript'
import { Brand } from './Brand'

@Table({
  modelName: 'companyBenefit',
  tableName: 'company_benefits'
})
export class CompanyBenefit extends Brand {
}