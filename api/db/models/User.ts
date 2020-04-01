import { Model, Table, Column, PrimaryKey, BeforeCreate, AutoIncrement, HasMany, IsNull, HasOne } from 'sequelize-typescript'
import * as bcrypt from 'bcrypt'
import constant from '../../config/constant'
import { Canvas } from './Canvas'
import { UserProfile } from './UserProfile'

@Table({
  modelName: 'user',
  tableName: 'users'
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @Column
  email: string

  @Column
  password: string

  @Column
  name: string

  @HasMany(() => Canvas)
  canvas: Canvas[]

  @HasOne(() => UserProfile)
  userProfile: UserProfile

  @BeforeCreate
  static hashPassword(instance: User) {
    const salt = bcrypt.genSaltSync(10)
    instance.password = bcrypt.hashSync(instance.password, salt).replace(constant.bcryptPrefixNode, constant.bcryptPrefixPhp)
  }
}