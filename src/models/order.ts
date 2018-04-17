import {
  BeforeCreate,
  Column,
  CreatedAt,
  DataType,
  Default,
  IsEmail,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  HasOne
} from 'sequelize-typescript'
import {User,Offer,Currency} from './'
import {consts} from '../config/static'
@Table({tableName: 'order', underscored: true})
export class Order extends Model < Order > {

  // only allow string keys to do some iteration :)
  [key : string] : any

  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  public id : string

  @ForeignKey(() => User)
  @Column({field: 'user_id'})
  userId : string;

  @ForeignKey(() => Offer)
  @Column({field: 'offer_id'})
  offerId : string;

  @Column
  public type : string

  @Default(consts.ORDER_STATUS_CREATED)
  @Column
  public status : number

  @Column
  public desc : string

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
  public slaughterSpec : string

  @Column({field: 'primal_cuts'})
  public primalCuts : string
  
  @Column({field: 'delivery_term'})
  public deliveryTerm : string

  @Column({field: 'place_of_origin'})
  public placeOfOrigin : string

  @Column({field: 'factory_num'})
  public factoryNum : string

  @Column({field: 'marble_score'})
  public marbleScore : string
  
  @Column
  public quantity : number

  @Column
  public bone : string

  @Column
  public price: number

  @ForeignKey(() => Currency)
  @Column({field: 'currency_id'})
  currencyId: string;
  
  @CreatedAt
  @Column({field: 'created_at'})
  public createdAt: Date

  @UpdatedAt
  @Column({field: 'updated_at'})
  public updatedAt: Date
}
