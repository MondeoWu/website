import { Model, Table, Column, PrimaryKey, BeforeCreate, Scopes, ForeignKey, HasMany } from 'sequelize-typescript'
import { UserCategory } from './UserCategory'

@Table({
  modelName: 'category',
  tableName: 'categories'
})
@Scopes({
  official: { where: { kind: 0 } },
  unofficial: { where: { kind: 1 } },
  active: { where: { deletedAt: null } }
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

  @Column
  deletedAt: Date

  @HasMany(() => UserCategory)
  userCategories: UserCategory[]
}