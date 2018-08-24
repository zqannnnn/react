import * as path from 'path'
import * as fs from 'fs'
import { Sequelize } from 'sequelize-typescript'
import { config } from './config/db'
import { beefOptions, consts, sheepOptions, vealOptions } from './config/static'
import {
  Category,
  Currency,
  Goods,
  Image,
  Transaction,
  User,
  Consignee
} from './models/'

const sequelize = new Sequelize(config)
sequelize.addModels([
  User,
  Transaction,
  Goods,
  Category,
  Image,
  Currency,
  Consignee
])

const initDatabase = async () => {
  await sequelize.sync({force:true})

  User.findOne({ where: { email: 'admin@admin.com' } }).then(user => {
    if (!user) {
      insertInitialData()
      // const currencyApi = require('./api/currency')
      // currencyApi.getApi()
    }
  })
}

//1532692062 chat test users
const addUserIfNoExists = (userObj: any) => {
  User.findOne({ where: { email: userObj.email } }).then(user => {
    if (!user) {
      const newUser = new User(userObj)
      newUser.save()
    }
  })
}

const addCurrencyIfNoExists = (currencyObj: any) => {
  Currency.findOne({ where: { code: currencyObj.code } }).then(currency => {
    if (!currency) {
      const newCurrency = new Currency(currencyObj)
      newCurrency.save()
    }
  })
}

const insertInitialData = () => {
   //1532692062 chat test users
  let usersDataFile = path.join(__dirname, './db_data/users.json')
  if (fs.existsSync(usersDataFile)) {
    let rawdata = fs.readFileSync(usersDataFile)
    let users = JSON.parse(rawdata.toString())
    for (var i = 0; i < users.length; i++) {
      addUserIfNoExists(users[i])
    }  
  }
  
  let currenciesDataFile = path.join(__dirname, './db_data/currencies.json')
  if (fs.existsSync(currenciesDataFile)) {
    let rawdata = fs.readFileSync(currenciesDataFile)
    let currencies = JSON.parse(rawdata.toString())
    for (var i = 0; i < currencies.length; i++) {
      addCurrencyIfNoExists(currencies[i])
    }  
  }
  

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

export { User, Transaction, Goods, Category, Image, initDatabase ,Consignee}
