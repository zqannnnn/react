import * as bcrypt from 'bcrypt'
import {
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
import { User } from './'
@Table({
    tableName: 'messages',
    underscored: true
})
export class Message extends Model<Message> {
    // only allow string keys to do some iteration :)
    [key: string]: any

    @IsUUID(4)
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column
    public id: string

    @CreatedAt
    @Column({ field: 'created_at' })
    public createdAt: Date

    @UpdatedAt
    @Column({ field: 'updated_at' })
    public updatedAt: Date

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({ field: 'from' })
    public from: string

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({ field: 'to' })
    public to: string

    @Column public message: string

    @Default(true)
    @Column({ field: 'is_new' })
    public isNew: boolean

}
