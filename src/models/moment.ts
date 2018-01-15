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
import { Screenshot } from './screenshot';
@Table({
  tableName: 'moment',
  underscored: true
})
export class Moment extends Model<Moment> {

  // only allow string keys to do some iteration :)
  [key: string]: any

  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  public id: string

  @Column({field: 'comment_number'})
  public commentNumber: number

  @Column({field: 'heart_number'})
  public heartNumber: number

  @Column({field: 'moment_at'})
  public momentAt: Date

  @CreatedAt
  @Column({field: 'created_at'})
  public createdAt: Date

  @UpdatedAt
  @Column({field: 'updated_at'})
  public updatedAt: Date

  @ForeignKey(() => User)
  @Column({field: 'user_id'})
  userId: string;
  
  @BelongsTo(() => User,'user_id')
  user: User; 

  @HasMany(() => Screenshot, 'moment_id')
  public screenshots: Screenshot[];
}
