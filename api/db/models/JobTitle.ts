import { Model, Table, Column, Scopes, BelongsToMany } from 'sequelize-typescript'
import { User } from './User'
import { UserJobTitle } from './UserJobTitle'

@Table({
  modelName: 'jobTitle',
  tableName: 'job_titles'
})
@Scopes({
  active: { where: { deletedAt: null } }
})
export class JobTitle extends Model<JobTitle> {
  @Column
  name: string

  @Column
  slug: string

  @Column
  titleImage: string

  @Column
  deletedAt: Date

  @BelongsToMany(() => User, () => UserJobTitle)
  users: User[]
}