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

  @Column({field: 'title_image'})
  titleImage: string

  @Column
  slug: string

  @Column
  status: string
}