import { Model, Table, Column } from 'sequelize-typescript'

@Table({
  modelName: 'software',
  tableName: 'softwares'
})
export class Software extends Model<Software> {
  @Column
  name: string

  @Column
  slug: string

  @Column
  deletedAt: Date
}