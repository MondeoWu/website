import { Model, Table, Column, PrimaryKey, BeforeCreate, BeforeSave } from 'sequelize-typescript'
import * as bcrypt from 'bcrypt'
import constant from '../../config/constant'

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

  @Column
  password: string

  @Column
  name: string

  @BeforeCreate
  static hashPassword(instance: User) {
    const salt = bcrypt.genSaltSync(10)
    instance.password = bcrypt.hashSync(instance.password, salt).replace(constant.bcryptPrefixNode, constant.bcryptPrefixPhp)
  }
}