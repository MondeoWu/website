import { Brand } from './Brand'
import { Model, Table, Column, Scopes } from 'sequelize-typescript'

@Table({
  modelName: 'permitStatus',
  tableName: 'permit_status'
})
export class PermitStatus extends Brand  {

}