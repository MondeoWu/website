import { Model, Table, Column, Scopes, BelongsToMany, BelongsTo, ForeignKey } from 'sequelize-typescript'
import { User } from './User'
import { JobTitle } from './JobTitle'

@Table({
  modelName: 'userJobTitle',
  tableName: 'user_job_titles'
})
export class UserJobTitle extends Model<UserJobTitle> {
  @ForeignKey(() => User)
  @Column({field: 'users_id'})
  userId: number
  
  @ForeignKey(() => JobTitle)
  @Column({field: 'Job_titles_id'})
  jobTitleId: number
}