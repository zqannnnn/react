'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'session',
            {
                sid: {
                    type: 'VARCHAR',
                    allowNull: false
                },
                sess: {
                    type: Sequelize.JSON,
                    allowNull: false
                },
                expire: {
                    type: 'TIMESTAMP',
                    allowNull: false
                }
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('session');
    }
};
