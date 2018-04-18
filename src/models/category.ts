import {
  BeforeCreate,
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
import { User } from './user'
@Table({
  tableName: 'category',
  underscored: true
})
export class Category extends Model<Category> {

  // only allow string keys to do some iteration :)
  [key: string]: any

  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  public id: string

  @Unique
  @Column({field: 'type'})
  public type: string

  @Column({
    field: 'details',
    type: DataType.JSONB
  })
  public details: object

}
