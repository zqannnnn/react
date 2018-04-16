import {
    Column,
    DataType,
    Default,
    IsUUID,
    Model,
    PrimaryKey,
    Table,
    HasOne
  } from 'sequelize-typescript'
  import { Offer } from '.';
  @Table({
    tableName: 'currency',
    underscored: true
  })
  export class Currency extends Model<Currency> {

    @IsUUID(4)
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column
    public id: string
  
    @Column({field:"currency"})
    public currency : string

    @HasOne(() => Offer,'currency_id')
    currencyId: string;
  }
  