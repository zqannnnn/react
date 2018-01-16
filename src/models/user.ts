import * as bcrypt from 'bcrypt'
import { DataTypeJSONB } from 'sequelize'
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
  BeforeUpdate,
  HasMany
} from 'sequelize-typescript'
import { consts } from '../config/static'
import { Order } from './order'
import { Product } from './product'
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

  @Column({ field: 'user_name' })
  public userName: string

  @Default(true)
  @Column({ field: 'is_active' })
  public isActive: boolean

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
  public orders: Order[];

  @HasMany(() => Product, 'user_id')
  public products: Product[];

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
