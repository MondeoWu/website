import { Model, Table, Column } from 'sequelize-typescript'

@Table({
  modelName: 'speciality',
  tableName: 'specialities'
})
export class Speciality extends Model<Speciality> {
  @Column
  name: string

  @Column
  slug: string

  @Column
  deletedAt: Date
}