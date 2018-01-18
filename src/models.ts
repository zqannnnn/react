import { Sequelize } from 'sequelize-typescript'
import { config } from './config/db'
import { consts,vealOptions } from './config/static'
import { User } from './models/user'
import { Product } from './models/product'
import { Order } from './models/order'
import { Offer } from './models/offer'

const sequelize = new Sequelize(config)
sequelize.addModels([User, Order, Offer])

const setupDatabase = async () => {
  await sequelize.sync({force:true})
  const user: User = new User({
    userName: 'louis',
    email: 'louis@qq.com',
    password: '1234567',
    userType: consts.USER_TYPE_ADMIN
  })
  await user.save()
  const product:Product = new Product({
    type:'Veal',
    options:vealOptions
  })
  await product.save()
}

const models = { User, Order, Offer, setupDatabase }
export = models
