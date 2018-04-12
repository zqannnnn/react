import { Sequelize } from 'sequelize-typescript'
import { config } from './config/db'
import { consts,beefOptions,vealOptions,sheepOptions } from './config/static'
import { User,Category,Order,Offer,Image } from './models/'

const sequelize = new Sequelize(config)
sequelize.addModels([User, Order, Offer, Category, Image])

const setupDatabase = async () => {
  await sequelize.sync()
  User.findOne({ where: {email: 'admin@admin.com'} }).then(user => {
    if(!user){ 
      user= new User({
        userName: 'admin',
        email: 'admin@admin.com',
        password: 'admin',
        userType: consts.USER_TYPE_ADMIN
      })
      user.save()
    }
    
  })
  Category.findOne({ where: {type: 'Beef'} }).then(categoryBeef => {
    if(!categoryBeef){
      categoryBeef = new Category({
        type:'Beef',
        details:beefOptions
      })
      categoryBeef.save()
    }
  })
  Category.findOne({ where: {type: 'Veal'} }).then(categoryVeal => {
    if(!categoryVeal){
      categoryVeal = new Category({
        type:'Veal',
        details:vealOptions
      })
      categoryVeal.save()
    }
  })
  Category.findOne({ where: {type: 'Sheep'} }).then(categorySheep => {
    if(!categorySheep){
      categorySheep = new Category({
        type:'Sheep',
        details:sheepOptions
      })
      categorySheep.save()
    }
  
})
}

export { User, Order, Offer, Category, Image, setupDatabase };
