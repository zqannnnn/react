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
import { User } from './user'
import { Offer } from './offer'
@Table({
  tableName: 'order',
  underscored: true
})
export class Order extends Model<Order> {

  // only allow string keys to do some iteration :)
  [key: string]: any

  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  public id: string

  @ForeignKey(() => User)
  @Column({field: 'user_id'})
  userId: string;
  
  @BelongsTo(() => User,'user_id')
  user: User;

  @ForeignKey(() => Offer)
  @Column({field: 'offer_id'})
  offerId: string;

  @Column
  public storage: string

  @Column
  public breed: string

  @Column
  public grade: string

  @Column
  public slaughterSpec: string

  @Column
  public primalCuts: string

  @Column
  public hamId: string

  @CreatedAt
  @Column({field: 'created_at'})
  public createdAt: Date

  @UpdatedAt
  @Column({field: 'updated_at'})
  public updatedAt: Date
}
