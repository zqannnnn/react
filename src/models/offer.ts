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
import {consts} from '../config/static'
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
  userId: string;
  
  @BelongsTo(() => User,'user_id')
  user: User;

  @Column
  public type : string

  @Default(consts.OFFER_STATUS_CREATED)
  @Column
  public status : number

  @Column
  public storage: string

  @Column
  public breed: string

  @Column
  public grade: string

  @Column({field: 'slaughter_spec'})
  public slaughterSpec : string

  @Column({field: 'primal_cuts'})
  public primalCuts : string

  @Column
  public bone : string

  @Column({field: 'ham_id'})
  public hamId: string

  @CreatedAt
  @Column({field: 'created_at'})
  public createdAt: Date

  @UpdatedAt
  @Column({field: 'updated_at'})
  public updatedAt: Date
}
