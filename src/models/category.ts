import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
@Table({
  tableName: 'category',
  underscored: true
})
export class Category extends Model<Category> {
  // only allow string keys to do some iteration :)
  [key: string]: any

  @PrimaryKey
  @Column({ field: 'type' })
  public type: string

  @Column({
    field: 'details',
    type: DataType.JSONB
  })
  public details: object
}
