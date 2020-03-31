import { Model, Table, Column, PrimaryKey, BeforeCreate, Scopes } from 'sequelize-typescript'

@Table({
  modelName: 'category',
  tableName: 'categories'
})
@Scopes({
  official: { where: { kind: 0 } },
  unofficial: { where: { kind: 1 } }
})
export class Category extends Model<Category> {
  @Column
  name: string

  @Column({field: 'title_image'})
  titleImage: string

  @Column
  slug: string

  @Column
  status: string

  @Column
  kind: number
}