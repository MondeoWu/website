import { Model, Table, Column } from 'sequelize-typescript'

@Table({
  modelName: 'brand',
  tableName: 'brands'
})
export class Brand extends Model<Brand> {
  @Column
  name: string

  @Column
  slug: string

  @Column
  deletedAt: Date
}