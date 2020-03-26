import { Model, Table, Column, PrimaryKey, BeforeCreate } from 'sequelize-typescript'

@Table({
  modelName: 'category',
  tableName: 'categories'
})
export class Category extends Model<Category> {
  @PrimaryKey
  @Column
  id: number

  @Column
  name: string

  @Column
  title_image: string

  @Column
  slug: string

  @Column
  status: string
}