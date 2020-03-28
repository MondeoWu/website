import { Model, Table, Column, PrimaryKey, BeforeCreate, AutoIncrement, ForeignKey } from 'sequelize-typescript'
import { User } from './User'

@Table({
  modelName: 'userProfile',
  tableName: 'user_profiles'
})
export class UserProfile extends Model<UserProfile> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @ForeignKey(() => User)
  @Column({field: 'user_id'})
  userId: number

  @Column
  profileImage: string
}