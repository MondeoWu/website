import { Model, Table, Column, Scopes } from 'sequelize-typescript'

@Table({
  modelName: 'brand',
  tableName: 'brands'
})
@Scopes({
  active: { where: { deletedAt: null } }
})
export class Brand extends Model<Brand> {
  @Column
  name: string

  @Column
  slug: string

  @Column
  deletedAt: Date
}