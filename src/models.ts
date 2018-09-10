import * as path from 'path'
import * as fs from 'fs'
import { Sequelize } from 'sequelize-typescript'
import { config } from './config/db'
import {
  Category,
  Currency,
  Goods,
  Image,
  Transaction,
  User,
  Message,
  Consignee,
  Comment,
  Country,
} from './models/'

const sequelize = new Sequelize(config)
sequelize.addModels([
  User,
  Transaction,
  Goods,
  Category,
  Image,
  Currency,
  Message,
  Consignee,
  Comment,
  Country
])

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
const addCountryIfNoExists = (countryObj: any) => {
  Country.findOne({ where: { code: countryObj.code } }).then((country:any) => {
    if (!country) {
      const newCountry = new Country(countryObj)
      newCountry.save()
    }
  })
  const addCategoryIfNoExists = (categoryObj: any) => {
    Category.findOne({ where: { type: categoryObj.type } }).then((category:any) => {
      if (!category) {
        const newCategory = new Category(categoryObj)
        newCategory.save()
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
    let countriesDataFile = path.join(__dirname, './db_data/countries.json')
    if (fs.existsSync(countriesDataFile)) {
      let rawdata = fs.readFileSync(countriesDataFile)
      let countries = JSON.parse(rawdata.toString())
      for (var i = 0; i < countries.length; i++) {
        addCountryIfNoExists(countries[i])
      }
    }

    let categoriesDataFile = path.join(__dirname, './db_data/categories.json')
    if (fs.existsSync(categoriesDataFile)) {
      let rawdata = fs.readFileSync(categoriesDataFile)
      let categories = JSON.parse(rawdata.toString())
      for (var i = 0; i < categories.length; i++) {
        addCategoryIfNoExists(categories[i])
      }
    }
  }
  const initDatabase = async () => {
    await sequelize.sync({ force: true })
  
    User.findOne({ where: { email: 'admin@admin.com' } }).then((user:any) => {
      if (!user) {
        insertInitialData()
        // const currencyApi = require('./api/currency')
        // currencyApi.getApi()
      }
    })
  }
  export { User, Transaction, Goods, Category, Image, initDatabase, Consignee, Country, Message }
