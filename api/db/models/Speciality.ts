import { Table } from 'sequelize-typescript'
import { Brand } from './Brand'

@Table({
  modelName: 'speciality',
  tableName: 'specialities'
})
export class Speciality extends Brand {
}