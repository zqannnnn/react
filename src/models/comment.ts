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
  Unique,
  UpdatedAt
} from 'sequelize-typescript'
import { User } from './'
import { Transaction } from './'
@Table({
  tableName: 'comment',
  underscored: true
})
export class Comment extends Model<Comment> {
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

  @ForeignKey(() => Transaction)
  @Column({ field: 'transaction_id' })
  public transactionId: string

  @Column({ field: 'content' })
  public content: string

  @ForeignKey(() => Comment)
  @Column({ field: 'reply_to' })
  public replyTo: string

  @BelongsTo(() => Comment)
  public replyToComment: Comment

  @ForeignKey(() => Comment)
  @Column({ field: 'root_id' })
  public rootId: string

  @CreatedAt
  @Column({ field: 'created_at' })
  public createdAt: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt: Date
}
