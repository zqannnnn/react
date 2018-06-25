import { Sequelize } from 'sequelize-typescript'
import { config } from './config/db'
import { beefOptions, consts, sheepOptions, vealOptions } from './config/static'
import { Category, Currency, Image, Transaction, User } from './models/'

const sequelize = new Sequelize(config)
sequelize.addModels([User, Transaction, Category, Image, Currency])

const initDatabase = async () => {
  console.log(`initDatabase`)
  await sequelize.sync()
  User.findOne({ where: { email: 'admin@admin.com' } }).then(user => {
    if (!user) {
      console.log(`initDatabase 1`)
      insertInitialData()
      const currencyApi = require('./api/currency')
      currencyApi.getApi()      
    } else {
      console.log(`initDatabase 2`)
    }
  })
}

const insertInitialData = () => {
  User.findOne({ where: { email: 'admin@admin.com' } }).then(user => {
    if (!user) {
      const newUser = new User({
        email: 'admin@admin.com',
        password: 'admin',
        userType: consts.USER_TYPE_ADMIN
      })
      newUser.save()
    }
  })
  Category.findOne({ where: { type: 'Beef' } }).then(categoryBeef => {
    if (!categoryBeef) {
      categoryBeef = new Category({
        type: 'Beef',
        details: beefOptions
      })
      categoryBeef.save()
    }
  })
  Category.findOne({ where: { type: 'Veal' } }).then(categoryVeal => {
    if (!categoryVeal) {
      categoryVeal = new Category({
        type: 'Veal',
        details: vealOptions
      })
      categoryVeal.save()
    }
  })
  Category.findOne({ where: { type: 'Sheep' } }).then(categorySheep => {
    if (!categorySheep) {
      categorySheep = new Category({
        type: 'Sheep',
        details: sheepOptions
      })
      categorySheep.save()
    }
  })
}

export { User, Transaction, Category, Image, initDatabase }
