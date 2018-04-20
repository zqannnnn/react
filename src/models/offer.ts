import {
  BeforeCreate,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  IsEmail,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt
} from 'sequelize-typescript'
import {consts} from '../config/static'
import { Currency, Image, User } from './'
@Table({
  tableName: 'offer',
  underscored: true
})
export class Offer extends Model<Offer> {

  // only allow string keys to do some iteration :)
  [key: string]: any

  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  public id: string

  @ForeignKey(() => User)
  @Column({field: 'user_id'})
  public userId: string

  @BelongsTo(() => User)
  public user: User

  @Column
  public type: string

  @Column
  public title: string

  @Column
  public desc: string

  @Default(consts.OFFER_STATUS_CREATED)
  @Column
  public status: number

  @Column
  public storage: string

  @Column
  public breed: string

  @Column
  public grade: string

  @Column
  public fed: string

  @Column({field: 'grain_fed_days'})
  public grainFedDays: number

  @Column({field: 'slaughter_spec'})
  public slaughterSpec: string

  @Column({field: 'primal_cuts'})
  public primalCuts: string

  @Column({field: 'delivery_term'})
  public deliveryTerm: string

  @Column({field: 'place_of_origin'})
  public placeOfOrigin: string

  @Column({field: 'factory_num'})
  public factoryNum: string

  @Column({field: 'marble_score'})
  public marbleScore: string

  @Column
  public quantity: number

  @Column
  public bone: string

  @Column
  public price: number

  @Column
  public trimmings: number

  @ForeignKey(() => Currency)
  @Column({field: 'currency_code'})
  public currencyCode: string

  @BelongsTo(() => Currency)
  public currency: Currency


  @HasMany(() => Image, 'offer_id')
  public images: Image[]

  @CreatedAt
  @Column({field: 'created_at'})
  public createdAt: Date

  @UpdatedAt
  @Column({field: 'updated_at'})
  public updatedAt: Date
}
