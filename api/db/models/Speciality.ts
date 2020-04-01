import { Model, Table, Column, Scopes } from 'sequelize-typescript'

@Table({
  modelName: 'speciality',
  tableName: 'specialities'
})
@Scopes({
  active: { where: { deletedAt: null } }
})
export class Speciality extends Model<Speciality> {
  @Column
  name: string

  @Column
  slug: string

  @Column
  deletedAt: Date
}