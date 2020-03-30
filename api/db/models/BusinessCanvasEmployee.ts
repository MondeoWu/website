import { Model, Table, Column, PrimaryKey, AutoIncrement, ForeignKey, BeforeSave, BeforeCreate, BelongsTo } from 'sequelize-typescript'
import { BusinessCanvas } from './BusinessCanvas'
import { User } from './User'
import { UserProfile } from './UserProfile'

@Table({
  modelName: 'businessEmployee',
  tableName: 'business_canvas_members'
})
export class BusinessCanvasEmployee extends Model<BusinessCanvasEmployee> {
  @ForeignKey(() => BusinessCanvas)
  @Column({field: 'business_canvas_id'})
  businessCanvasId: number

  @ForeignKey(() => User)
  @Column({field: 'user_id'})
  userId: number

  @Column
  name: string

  @Column({field: 'instagram_username'})
  instagramUsername: string

  @Column
  photo: string

  _delete: boolean

  // TODO
  @BeforeCreate
  static async hashPassword(instance: BusinessCanvasEmployee) {
    const user = await User.findOne({
      where: {id: instance.userId},
      include: [UserProfile]
    })
    instance.name = instance.name || user.name
    instance.photo = instance.photo || (user.UserProfile || {}).profileImage || ''
    instance.instagramUsername = instance.instagramUsername || instance.name
  }
}