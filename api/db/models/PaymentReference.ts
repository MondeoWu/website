import { Model, Table, Column } from 'sequelize-typescript'

@Table({
  modelName: 'paymentReference',
  tableName: 'payment_references'
})
export class PaymentReference extends Model<PaymentReference> {
  @Column
  name: string

  @Column
  slug: string

  @Column
  deketedAt: Date
}