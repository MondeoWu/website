import { Model, Table, Column, PrimaryKey, AutoIncrement, ForeignKey } from 'sequelize-typescript'
import { BusinessCanvas } from './BusinessCanvas'

@Table({
  modelName: 'canvas',
  tableName: 'canvas'
})
export class BusinessCanvasLocation extends Model<BusinessCanvasLocation> {
  @ForeignKey(() => BusinessCanvas)
  @Column
  userId: number

  @Column({field: 'upload_your_profile_photo'})
  profilePhoto: string
}