import { Brand } from './Brand'
import { Table } from 'sequelize-typescript'

@Table({
  modelName: 'pargram',
  tableName: 'programs'
})
export class Program extends Brand  {

}