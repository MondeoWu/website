import { Model, Table, Column, PrimaryKey, ForeignKey, BelongsTo, AutoIncrement, HasMany } from 'sequelize-typescript'
import { Category } from './Category'
import { User } from './User'
import { BusinessEmployee } from './BusinessEmployee'

@Table({
  modelName: 'businessCanvas',
  tableName: 'business_canvas'
})
export class BusinessCanvas extends Model<BusinessCanvas> {
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

  // Business canvas category
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

  @HasMany(() => BusinessEmployee)
  employees: BusinessEmployee[]
}