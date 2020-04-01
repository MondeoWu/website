import { Model, Table, Column, Scopes } from 'sequelize-typescript'

@Table({
  modelName: 'paymentReference',
  tableName: 'payment_references'
})
@Scopes({
  active: { where: { deletedAt: null } }
})
export class PaymentReference extends Model<PaymentReference> {
  @Column
  name: string

  @Column
  slug: string

  @Column
  deketedAt: Date
}