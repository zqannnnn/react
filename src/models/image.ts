import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript'
import { Transaction, User } from '.'
@Table({
  tableName: 'image',
  underscored: true
})
export class Image extends Model<Image> {
  // only allow string keys to do some iteration :)
  [key: string]: any

  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  public id: string

  @Column({ field: 'path' })
  public path: string

  @Column({ field: 'type' })
  public type: number

  @CreatedAt
  @Column({ field: 'created_at' })
  public createdAt: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt: Date

  @ForeignKey(() => Transaction)
  @Column({ field: 'transaction_id' })
  public transactionId: string

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  public userId: string
}
