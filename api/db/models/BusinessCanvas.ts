import { Model, Table, Column, PrimaryKey, ForeignKey, BelongsTo, AutoIncrement, HasMany, BeforeCreate, BeforeSave } from 'sequelize-typescript'
import { Category } from './Category'
import { User } from './User'
import { BusinessCanvasEmployee } from './BusinessCanvasEmployee'
import { BusinessCanvasLocation } from './BusinessCanvasLocation'
import { PaymentReference } from './PaymentReference'

@Table({
  modelName: 'businessCanvas',
  tableName: 'business_canvas'
})
export class BusinessCanvas extends Model<BusinessCanvas> {
  @ForeignKey(() => User)
  @Column({field: 'user_id'})
  userId: number

  @ForeignKey(() => PaymentReference)
  @Column({field: 'payment_plan_id'})
  paymentPreference: string

  @ForeignKey(() => Category)
  @Column({field: 'type_of_business'})
  businessCategoryID: string

  @BelongsTo(() => Category)
  businessCategory: Category

  @HasMany(() => BusinessCanvasEmployee)
  employees: BusinessCanvasEmployee[]

  // @HasMany(() => BusinessCanvasLocation)
  // location: BusinessCanvasLocation[]

  @Column({field: 'company_name'})
  companyName: string

  @Column({field: 'primary_phone'})
  primaryContactNumber: string

  @Column({field: 'no_of_employees'})
  numberOfEmployee: number

  @Column({field: 'no_of_chairs_in_salon'})
  numberOfChairs: string

  @Column({field: 'salon_square_footage'})
  squareFootage: string

  @Column
  deletedAt: Date

  @Column
  location: string

  @Column({field: 'slogan'})
  headline: string

  @Column({field: 'company_about_us'})
  description: string

  @Column
  logo: string

  @Column({field: 'feature_image'})
  featuredPhoto: string

  @Column
  teamPhoto: string

  @Column({field: 'company_video'})
  featuredVideo: string

  @Column({field: 'preferred_brands_retails'})
  retailBrands: string

  @Column
  softwareUsed: string

  @Column({field: 'preferred_brands_backbar'})
  backbarBrands: string

  @Column
  specialties: string

  @Column
  benefits: string

  @Column({field: 'awards_achievements_recognition'})
  awardsAndAchievements: string

  @Column({field: 'company_facebook_url'})
  facebookUrl: string
  
  @Column({field: 'company_linkedin_url'})
  linkedinUrl: string

  @Column({field: 'company_twitter_url'})
  twitterUrl: string

  @Column({field: 'company_instagram_url'})
  instagramUrl: string
}