import { Table } from 'sequelize-typescript'
import { Brand } from './Brand'

@Table({
  modelName: 'software',
  tableName: 'softwares'
})
export class Software extends Brand {
}