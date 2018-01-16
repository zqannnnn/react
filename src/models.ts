import { Sequelize } from 'sequelize-typescript'
import { config } from './config/db'
import { consts } from './config/static'
import { User } from './models/user'
import { Goods } from './models/goods'

const sequelize = new Sequelize(config)
sequelize.addModels([User, Goods])

const setupDatabase = async () => {
  await sequelize.sync({force:true})
  const user: User = new User({
    userName: 'louis',
    email: 'louis@qq.com',
    password: '1234567',
    userType: consts.USER_TYPE_ADMIN
  })
  await user.save()
}

const models = { User, Goods, setupDatabase }
export = models
