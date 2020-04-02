import { Model, Table, Column, PrimaryKey, BeforeCreate, AutoIncrement, ForeignKey, HasOne, BelongsTo, HasMany } from 'sequelize-typescript'
import { User } from './User'
import { UserRole } from './UserRole'
import { PermitStatus } from './PermitStatus'
import { Program } from './Program'
import { EmployStatus } from './EmployStatus'

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

  @BelongsTo(() => User)
  user: User

  @ForeignKey(() => UserRole)
  @Column
  userRoleId: number

  @BelongsTo(() => UserRole)
  userRole: UserRole

  @ForeignKey(() => PermitStatus)
  @Column
  permitStatusId: number

  @BelongsTo(() => PermitStatus)
  permitStatus: PermitStatus

  @ForeignKey(() => Program)
  @Column
  programId: number

  @BelongsTo(() => Program)
  program: Program

  @ForeignKey(() => EmployStatus)
  @Column
  employStatusId: number

  @BelongsTo(() => EmployStatus)
  employStatus: EmployStatus

  @Column
  profileImage: string
}