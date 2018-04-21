import {
    Column,
    DataType,
    Default,
    HasOne,
    IsUUID,
    Model,
    PrimaryKey,
    Table,
    Unique
  } from 'sequelize-typescript'
import { Offer } from '.'
@Table({
    tableName: 'currency',
    underscored: true
  })
  export class Currency extends Model<Currency> {

    @IsUUID(4)
    @PrimaryKey
    @Column({field: 'code'})
    public code: string

    @Column({field: 'symbol'})
    public symbol: string

    @Column({field: 'rate'})
    public rate: number
  }
