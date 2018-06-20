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
import { consts } from '../config/static'
import { Currency, Image, User } from './'
@Table({
  tableName: 'goods',
  underscored: true
})
export class Goods extends Model<Goods> {
  // only allow string keys to do some iteration :)
  [key: string]: any

  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  public id: string

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  public userId: string

  @BelongsTo(() => User)
  public user: User

  @ForeignKey(() => User)
  @Column({ field: 'owner_id' })
  public ownerId: string

  @BelongsTo(() => User)
  public owner: User

  @ForeignKey(() => User)
  @Column({ field: 'creator_id' })
  public creatorId: string

  @BelongsTo(() => User)
  public creator: User

  @Column public type: string

  @Column public category: string

  @Column public title: string

  @Column public desc: string

  @Column public storage: string

  @Column public breed: string

  @Column public grade: string

  @Column public address: string

  @Column public fed: string

  @Column public brand: string

  @Column({ field: 'grain_fed_days' })
  public grainFedDays: number

  @Column({ field: 'slaughter_spec' })
  public slaughterSpec: string

  @Column({ field: 'primal_cuts' })
  public primalCuts: string

  @Column({ field: 'delivery_term' })
  public deliveryTerm: string

  @Column({ field: 'place_of_origin' })
  public placeOfOrigin: string

  @Column({ field: 'factory_num' })
  public factoryNum: string

  @Column({ field: 'marble_score' })
  public marbleScore: string

  @Column public quantity: number

  @Column public bone: string

  @Column public price: number

  @Column public trimmings: number

  @HasMany(() => Image, 'goods_id')
  public images: Image[]

  @CreatedAt
  @Column({ field: 'created_at' })
  public createdAt: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt: Date
}
