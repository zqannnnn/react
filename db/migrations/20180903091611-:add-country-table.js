'use strict';
var fs = require('fs')
var path = require('path')
module.exports = {
  up:async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   
  await queryInterface.sequelize.transaction(async function handleTransaction(t) {
    let countryDataFile = path.join(__dirname, '../../src/db_data/countries.json')
      let rawdata = fs.readFileSync(countryDataFile)
      let jsonData =  JSON.parse(rawdata.toString())
      await queryInterface.addColumn('user', 'country',{type: Sequelize.STRING})
      await queryInterface.createTable(
        'country',
        {
          code:
          {
           type: Sequelize.STRING,
           primaryKey: true
         },
          latitude:Sequelize.STRING,
          longitude: Sequelize.STRING,
          name: Sequelize.STRING
        }
       )
       
       await queryInterface.addConstraint('user', ['country'], {
        type: 'foreign key',
        name: 'user_country_fk',
        references:{
          table:"country",
          field:"code"  
        }
      })
      await queryInterface.bulkInsert('country',jsonData,{transaction:t})

  })
   
  },

  down:async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.sequelize.transaction(async function handleTransaction(t) {
      await queryInterface.removeConstraint('user','user_country_fk')
      await queryInterface.removeColumn('user', 'country',{ transaction: t })
      await queryInterface.dropTable('country')
      
  })
  }
};