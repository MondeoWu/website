import { Model, Table, Column, DataType, ForeignKey, BelongsTo, PrimaryKey } from 'sequelize-typescript'

// export type BookmarkType = keyof typeof _BookmarkType
@Table({
  modelName: 'user',
  tableName: 'users'
})
export class User extends Model<User> {
  @PrimaryKey
  @Column
  id: number

  @Column
  email: string
}
