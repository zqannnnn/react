'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface
   .sequelize
   .transaction( async function handleTransaction(t) {
      await queryInterface.addColumn('goods', 'proof', {type: Sequelize.DataTypes.JSONB})
      await queryInterface.addColumn('goods', 'proofstatus', {type: Sequelize.INTEGER})
   })
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface
   .sequelize
   .transaction( async function handleTransaction(t) {
      await queryInterface.removeColumn('goods', 'proof')
      await queryInterface.removeColumn('goods', 'proofstatus')

   })
  }
};
