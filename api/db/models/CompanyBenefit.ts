import { Model, Table, Column } from 'sequelize-typescript'

@Table({
  modelName: 'companyBenefit',
  tableName: 'company_benefits'
})
export class CompanyBenefit extends Model<CompanyBenefit> {
  @Column
  name: string

  @Column
  slug: string

  @Column
  deletedAt: Date
}