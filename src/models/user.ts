import * as bcrypt from 'bcrypt'
import { DataTypeJSONB } from 'sequelize'
import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  IsEmail,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt
} from 'sequelize-typescript'
import { consts } from '../config/static'
import { Currency, Image, Offer, Order } from './'
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

  @Column public password: string

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
  @Column({ field: 'preferred_currency_code' })
  public preferredCurrencyCode: string

  @BelongsTo(() => Currency, 'preferred_currency')
  public preferredCurrency: Currency

  @Column public desc: string

  // fields for company
  @Column({ field: 'company_name' })
  public companyName: string

  @Column({ field: 'company_address' })
  public companyAddress: string

  @HasMany(() => Image, 'user_id')
  public businessLicenses: Image[]

  @Column({ field: 'license_status' })
  public licenseStatus: number

  // class methods
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
