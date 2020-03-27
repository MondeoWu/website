import { Model, Table, Column, PrimaryKey, AutoIncrement, ForeignKey, BeforeSave, BeforeCreate } from 'sequelize-typescript'
import { Business } from './Business'
import { User } from './User'
import Boom from 'boom'
import { Canvas } from './Canvas'

@Table({
  modelName: 'businessEmployee',
  tableName: 'business_canvas_members'
})
export class BusinessEmployee extends Model<BusinessEmployee> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @ForeignKey(() => Business)
  @Column({field: 'business_canvas_id'})
  businessID: number

  @ForeignKey(() => User)
  @Column({field: 'user_id'})
  userID: number

  @Column
  name: string

  @Column({field: 'instagram_username'})
  instagramUsername: string

  @Column
  photo: string

  // TODO
  @BeforeCreate
  static async hashPassword(instance: BusinessEmployee) {
    
    const user = await User.findOne({
      where: {id: instance.userID},
      include: [{
        model: Canvas,
        required: false,
        where: { deleted_at: null }
      }]
    })
    instance.name = instance.name || user.name
    console.log(user.profilePhoto())
    instance.photo = instance.photo || user.profilePhoto() || ''
    instance.instagramUsername = instance.instagramUsername || instance.name
  }
}