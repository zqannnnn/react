import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript'
import { consts } from '../config/static'
import { Currency, User } from './'
import { Goods } from './goods'
@Table({
  tableName: 'transaction',
  underscored: true
})
export class Transaction extends Model<Transaction> {
  // only allow string keys to do some iteration :)
  [key: string]: any

  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  public id: string

  @ForeignKey(() => User)
  @Column({ field: 'taker_id' })
  public takerId: string

  @BelongsTo(() => User)
  public taker: User

  @ForeignKey(() => User)
  @Column({ field: 'maker_id' })
  public makerId: string

  @BelongsTo(() => User)
  public maker: User

  @ForeignKey(() => Goods)
  @Column({ field: 'goods_id' })
  public goodsId: string

  @BelongsTo(() => Goods)
  public goods: Goods

  @Column public type: string

  @Column public category: string

  @Default(consts.TRANSACTION_STATUS_CREATED)
  @Column
  public status: number

  @Column public price: number

  @Column({ type: DataType.TEXT })
  public comment: string

  @ForeignKey(() => Currency)
  @Column({ field: 'currency_code' })
  public currencyCode: string

  @BelongsTo(() => Currency)
  public currency: Currency

  @Column({ field: 'is_maker_seller' })
  public isMakerSeller: boolean

  @CreatedAt
  @Column({ field: 'created_at' })
  public createdAt: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt: Date
}
