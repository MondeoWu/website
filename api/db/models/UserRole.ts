import { Table } from 'sequelize-typescript'
import { Brand } from './Brand'

@Table({
  modelName: 'userRole',
  tableName: 'user_roles'
})
export class UserRole extends Brand {

}