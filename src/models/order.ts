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
  HasMany
} from 'sequelize-typescript'
import {User,Offer} from './'
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
  public storage : string

  @Column
  public breed : string

  @Column
  public grade : string

  @Column({field: 'slaughter_spec'})
  public slaughterSpec : string

  @Column({field: 'primal_cut'})
  public primalCut : string

  @Column({field: 'delivery_term'})
  public deliveryTerm : string

  @Column({field: 'place_of_origin'})
  public placeOfOrigin : string

  @Column({field: 'marble_score'})
  public marbleScore : string
  
  @Column
  public quantity : number

  @Column
  public bone : string

  @Column
  public price: number

  @CreatedAt
  @Column({field: 'created_at'})
  public createdAt : Date

  @UpdatedAt
  @Column({field: 'updated_at'})
  public updatedAt : Date
}
