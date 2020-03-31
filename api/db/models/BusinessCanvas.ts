import { Model, Table, Column, PrimaryKey, ForeignKey, BelongsTo, AutoIncrement, HasMany, BeforeCreate, BeforeSave } from 'sequelize-typescript'
import { Category } from './Category'
import { User } from './User'
import { BusinessCanvasEmployee } from './BusinessCanvasEmployee'
import { PaymentReference } from './PaymentReference'
import { Brand } from './Brand'
import { Software } from './Software'
import { Speciality } from './Speciality'
import { CompanyBenefit } from './CompanyBenefit'

function needDetail(kls) {
  return (target, attr) => {
    BusinessCanvas.detailColumns = (BusinessCanvas.detailColumns || []).concat({kls, name: attr})
  }
}

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
  paymentPreferenceId: string

  @ForeignKey(() => Category)
  @Column({field: 'type_of_business'})
  businessCategoryId: string

  @BelongsTo(() => PaymentReference)
  paymentPreference: PaymentReference

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

  @needDetail(Brand)
  @Column({field: 'preferred_brands_retails'})
  retailBrands: string

  @needDetail(Software)
  @Column
  softwareUsed: string

  @needDetail(Brand)
  @Column({field: 'preferred_brands_backbar'})
  backbarBrands: string

  @needDetail(Speciality)
  @Column
  specialties: string

  @needDetail(CompanyBenefit)
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

  static detailColumns: {kls: any, name: string}[]

  async detail(): Promise<BusinessCanvas> {
    for (const column of BusinessCanvas.detailColumns) {
      if (!this[column.name]) continue

      this[column.name] = await column.kls.findAll({
        attributes: ['id', 'name'],
        where: { id: JSON.parse(this[column.name]) }
      })
      console.log(column.name, this[column.name])
    }
    return this
  }
}