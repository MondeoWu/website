import { Table } from 'sequelize-typescript'
import { Brand } from './Brand'

@Table({
  modelName: 'paymentReference',
  tableName: 'payment_references'
})
export class PaymentReference extends Brand {
}