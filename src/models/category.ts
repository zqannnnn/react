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

  @Column({field: 'type'})
  public type: string

  @Column({
    field: 'details',
    type: DataType.JSONB
  })
  public details: object

}
