import { Model, Table, Column, Scopes, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { User } from './User'

@Table({
  modelName: 'socialAccount',
  tableName: 'social_accounts'
})
export class SocialAccount extends Model<SocialAccount> {
  @ForeignKey(() => User)
  @Column
  userId: number

  @BelongsTo(() => User)
  user: User

  @Column
  platform: string

  @Column
  email: string

  @Column
  uuid: string

  @Column
  name: string

  @Column
  image: string
}