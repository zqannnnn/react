import * as bcrypt from 'bcrypt'
import { DataTypeJSONB } from 'sequelize'
import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  IsEmail,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript'
import { Offer, Order,Currency } from './'
import { consts } from '../config/static'
@Table({
  tableName: 'user',
  underscored: true
})
export class User extends Model<User> {

  // only allow string keys to do some iteration :)
  [key: string]: any

  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  public id: string

  @Column({ field: 'user_type' })
  public userType: number

  @Unique
  @IsEmail
  @Column
  public email: string

  @Default(true)
  @Column({ field: 'is_active' })
  public isActive: boolean

  @Column({ field: 'first_name' })
  public firstName: string

  @Column({ field: 'last_name' })
  public lastName: string

  @Column
  public password: string

  @Column({ field: 'reset_key' })
  public resetKey: string

  @CreatedAt
  @Column({ field: 'created_at' })
  public createdAt: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt: Date

  @HasMany(() => Order, 'user_id')
  public orders: Order[]

  @HasMany(() => Offer, 'user_id')
  public offers: Offer[]

  @ForeignKey(() => Currency)
  @Column({field: 'prefered_currency_code'})
  public preferedCurrencyCode: string

  @BelongsTo(() => Currency,'prefered_currency')
  public preferedCurrency: Currency

  // class methods
  @BeforeUpdate
  @BeforeCreate
  public static hashPassword = async (instance: User) => {
    if (instance.password) {
      instance.password = await bcrypt.hash(instance.password, 10)
    }
  }

  // instance methods
  public validatePassword = (pwd: string) => {
    if (this.password) {
      return bcrypt.compare(pwd, this.password)
    }
    return false
  }
}
