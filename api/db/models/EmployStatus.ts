import { Brand } from './Brand'
import { Table } from 'sequelize-typescript'

@Table({
  modelName: 'employStatus',
  tableName: 'employ_status'
})
export class EmployStatus extends Brand  {

}