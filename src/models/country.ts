import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript'
@Table({
  tableName: 'country',
  underscored: true
})
export class Country extends Model<Country> {
  @PrimaryKey
  @Column({ field: 'code' })
  public code: string

  @Column({ field: 'latitude' })
  public latitude: number

  @Column({ field: 'longitude' })
  public longitude: number

  @Column({ field: 'name' })
  public name: string
}
