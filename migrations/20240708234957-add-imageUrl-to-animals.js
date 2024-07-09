'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('animals', 'imageUrl', {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('animals', 'imageUrl');
    }
};