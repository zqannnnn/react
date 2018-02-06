import { Sequelize } from 'sequelize-typescript'
import { config } from './config/db'
import { consts,beefOptions,vealOptions,sheepOptions } from './config/static'
import { User,Category,Order,Offer,Image } from './models/'

const sequelize = new Sequelize(config)
sequelize.addModels([User, Order, Offer, Category, Image])

const setupDatabase = async () => {
  await sequelize.sync()
  const user: User = new User({
    userName: 'louis',
    email: 'louis@qq.com',
    password: '1234567',
    userType: consts.USER_TYPE_ADMIN
  })
  await user.save()
  const categoryBeef:Category = new Category({
    type:'Beef',
    details:beefOptions
  })
  await categoryBeef.save()
  const categoryVeal:Category = new Category({
    type:'Veal',
    details:vealOptions
  })
  await categoryVeal.save()
  const categorySheep:Category = new Category({
    type:'Sheep',
    details:sheepOptions
  })
  await categorySheep.save()
}

const models = { User, Order, Offer, Category, Image, setupDatabase }
export = models
