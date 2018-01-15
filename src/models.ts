import { Sequelize } from 'sequelize-typescript'
import { config } from './config/db'
import { consts } from './config/static'
import { User } from './models/user'
import { Moment } from './models/moment'
import { Screenshot } from './models/screenshot'

const sequelize = new Sequelize(config)
sequelize.addModels([User, Moment, Screenshot])

const setupDatabase = async () => {
  await sequelize.sync()
  const user: User = new User({
    userName: 'louis',
    email: 'louis@qq.com',
    password: '1234567',
    userType: consts.USER_TYPE_ADMIN
  })
  await user.save()
}

const models = { User, Moment, setupDatabase }
export = models
