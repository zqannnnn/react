'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addConstraint('session', ['sid'], {
            type: 'primary key',
            name: 'session_pkey',
            references: {
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            },
        })

    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeConstraint('session', 'session_pkey', {})
    }
};
