'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface
   .sequelize
   .transaction( function handleTransaction(t) {
     return Promise.all([
       queryInterface.addColumn('goods', 'proof', {type: Sequelize.DataType.JSONB}),
       queryInterface.addColumn('goods', 'proofstatus', {type: Sequelize.Boolean})
     ])
      
      


   })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface
   .sequelize
   .transaction( function handleTransaction(t) {
     return Promise.all([
      queryInterface.removeColumn('goods', 'proof', {type: Sequelize.DataType.JSONB}),
      queryInterface.removeColumn('goods', 'proofstatus', {type: Sequelize.Boolean})
     ])
      


   })
  }
};
