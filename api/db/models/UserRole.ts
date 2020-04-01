import { Model, Table, Column, Scopes } from 'sequelize-typescript'

@Table({
  modelName: 'userRole',
  tableName: 'user_roles'
})
@Scopes({
  active: { where: { deletedAt: null } }
})
export class UserRole extends Model<UserRole> {
  @Column
  name: string

  @Column
  slug: string

  @Column
  deletedAt: Date
}