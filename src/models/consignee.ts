import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  IsEmail,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt
} from 'sequelize-typescript'
import { User } from './'
@Table({
  tableName: 'consignee',
  underscored: true
})
export class Consignee extends Model<Consignee> {
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

  @Column({ field: 'address' })
  public address: string

  @IsEmail
  @Column
  public email: string

  @Column({ field: 'phone_num' })
  public phoneNum: string

  @Column({ field: 'name' })
  public name: string

  @CreatedAt
  @Column({ field: 'created_at' })
  public createdAt: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt: Date
}
