import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript'
import { consts } from '../config/static'
import { Comment, Currency, User } from './'
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

  @BelongsTo(() => User, 'taker_id')
  public taker: User

  @ForeignKey(() => User)
  @Column({ field: 'maker_id' })
  public makerId: string

  @BelongsTo(() => User, 'maker_id')
  public maker: User

  @ForeignKey(() => Goods)
  @Column({ field: 'goods_id' })
  public goodsId: string

  @BelongsTo(() => Goods)
  public goods: Goods

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

  @HasMany(() => Comment, 'transaction_id')
  public comments: Comment[]

  @Column({ field: 'is_maker_seller' })
  public isMakerSeller: boolean

  @CreatedAt
  @Column({ field: 'created_at' })
  public createdAt: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt: Date
}
