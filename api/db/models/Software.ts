import { Model, Table, Column, Scopes } from 'sequelize-typescript'

@Table({
  modelName: 'software',
  tableName: 'softwares'
})
@Scopes({
  active: { where: { deletedAt: null } }
})
export class Software extends Model<Software> {
  @Column
  name: string

  @Column
  slug: string

  @Column
  deletedAt: Date
}