import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
@Table({
  tableName: 'currency',
  underscored: true
})
export class Currency extends Model<Currency> {
  @PrimaryKey
  @Column({ field: 'code' })
  public code: string

  @Column({ field: 'symbol' })
  public symbol: string

  @Column({ type: DataType.DOUBLE })
  public rate: number

  @Column public description: string
}
