import { Model, Table, Column, PrimaryKey, AutoIncrement, ForeignKey, Scopes } from 'sequelize-typescript'
import { BusinessCanvas } from './BusinessCanvas'

@Table({
  modelName: 'canvas',
  tableName: 'canvas'
})
@Scopes({
  active: { where: { deletedAt: null } }
})
export class BusinessCanvasLocation extends Model<BusinessCanvasLocation> {
  @ForeignKey(() => BusinessCanvas)
  @Column
  businessCanvasId: number

  @Column
  location: string

  // @Column
  // state: string

  @Column
  deletedAt: Date
}