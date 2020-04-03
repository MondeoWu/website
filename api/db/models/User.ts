import { Model, Table, Column, PrimaryKey, BeforeCreate, AutoIncrement, HasMany, IsNull, HasOne, BelongsToMany } from 'sequelize-typescript'
import * as bcrypt from 'bcrypt'
import constant from '../../config/constant'
import { Canvas } from './Canvas'
import { UserProfile } from './UserProfile'
import { SocialAccount } from './SocialAccount'
import { UserCategory } from './UserCategory'
import { JobTitle } from './JobTitle'
import { UserJobTitle } from './UserJobTitle'

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

  @HasMany(() => SocialAccount)
  socialAccounts: SocialAccount[]

  @HasMany(() => UserCategory)
  userCategories: UserCategory[]

  @BelongsToMany(() => JobTitle, () => UserJobTitle)
  jobTitles: JobTitle[]

  @BeforeCreate
  static hashPassword(instance: User) {
    const salt = bcrypt.genSaltSync(10)
    instance.password = bcrypt.hashSync(instance.password, salt).replace(constant.bcryptPrefixNode, constant.bcryptPrefixPhp)
  }
}