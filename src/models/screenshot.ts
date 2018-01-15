import {
    Column,
    CreatedAt,
    DataType,
    Default,
    IsUUID,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
    ForeignKey,
    BelongsTo
  } from 'sequelize-typescript'
  import { Moment } from './moment'
  @Table({
    tableName: 'screenshot',
    underscored: true
  })
  export class Screenshot extends Model<Screenshot> {
  
    // only allow string keys to do some iteration :)
    [key: string]: any
  
    @IsUUID(4)
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column
    public id: string
  
    @Column({field:"path"})
    public path : string
  
    @CreatedAt
    @Column({field: 'created_at'})
    public createdAt: Date
  
    @UpdatedAt
    @Column({field: 'updated_at'})
    public updatedAt: Date
  
    @ForeignKey(() => Moment)
    @Column({field: 'moment_id'})
    public momentId: string;
  
  }
  