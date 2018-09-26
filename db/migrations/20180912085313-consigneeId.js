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
    .transaction(async function handleTransaction(t) {
      await queryInterface.addColumn('goods', 'consignee_id', {type: Sequelize.STRING})
      await queryInterface.addConstraint('goods', ['consignee_id'], {
        type: 'foreign key',
        name: 'goods_consignee_fk',
        references: {
          table: "consignee",
          field: "id"
        },
        onDelete: 'set null',
        onUpdate: 'cascade'
      })

    })
  },

  down: async(queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface
    .sequelize
    .transaction(async function handleTransaction(t) {
      try {
        await queryInterface.removeConstraint('goods', 'goods_consignee_fk', { transaction: t })
        await queryInterface.removeColumn('goods', 'consignee_id', { transaction: t })
      } catch (error) {
        console.log(error)
      }
    })
  }
};
