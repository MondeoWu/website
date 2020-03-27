import { Model, Table, Column, PrimaryKey, AutoIncrement, ForeignKey } from 'sequelize-typescript'
import { User } from './User'

@Table({
  modelName: 'canvas',
  tableName: 'canvas'
})
export class Canvas extends Model<Canvas> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @ForeignKey(() => User)
  @Column({field: 'user_id'})
  userId: number

  @Column({field: 'upload_your_profile_photo'})
  profilePhoto: string
}