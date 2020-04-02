import { Model, Table, Column, Scopes, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { User } from './User'
import { Category } from './Category'

@Table({
  modelName: 'userCategory',
  tableName: 'user_categories'
})
export class UserCategory extends Model<UserCategory> {
  @ForeignKey(() => User)
  @Column({field: 'users_id'})
  userId: number

  @ForeignKey(() => Category)
  @Column({field: 'categories_id'})
  categoryId: number

  @BelongsTo(() => Category)
  userCategory: Category

  @Column
  licenseNo: string
}