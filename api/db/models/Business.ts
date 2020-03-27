import { Model, Table, Column, PrimaryKey, ForeignKey, BelongsTo, AutoIncrement } from 'sequelize-typescript'
import { Category } from './Category'
import { User } from './User'

@Table({
  modelName: 'business',
  tableName: 'business_canvas'
})
export class Business extends Model<Business> {
  @PrimaryKey
  @AutoIncrement
  @Column({field: 'id'})
  id: number

  @ForeignKey(() => User)
  @Column({field: 'user_id'})
  userID: number

  @Column({field: 'company_name'})
  companyName: string

  @Column({field: 'primary_phone'})
  primaryContactNumber: string

  // Business category
  @ForeignKey(() => Category)
  @Column({field: 'type_of_business'})
  businessCategoryID: string

  @BelongsTo(() => Category)
  businessCategory: Category

  // Number of employee
  @Column({field: 'no_of_employees'})
  numberOfEmployee: number

  // Number of chairs
  @Column({field: 'no_of_chairs_in_salon'})
  numberOfChairs: string

  // Square footage
  @Column({field: 'salon_square_footage'})
  squareFootage: string

  @Column
  location: string

  @Column({field: 'deleted_at'})
  deletedAt: Date
}