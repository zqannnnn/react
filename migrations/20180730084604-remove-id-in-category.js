'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.removeConstraint('category', 'category_pkey', {
          transaction: t
        }),
        queryInterface.removeColumn('category', 'id', { transaction: t }),
        queryInterface.addConstraint('category', ['type'], {
          type: 'primary key',
          name: 'category_type_pk',
          transaction: t
        }),
        queryInterface.removeConstraint('category', 'category_type_key', {
          transaction: t
        })
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
    queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.removeConstraint('category', 'category_type_pk'),
        queryInterface.addConstraint('category', ['type'], {
          type: 'unique',
          name: 'category_type_un'
        }),
        queryInterface.addColumn('category', 'id', {
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4
        }),
        queryInterface.addConstraint('category', ['id'], {
          type: 'primary key',
          name: 'category_id_pk'
        })
      ])
    })
  }
}
