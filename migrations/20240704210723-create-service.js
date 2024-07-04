'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('services', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [3, 30],
                        msg: 'Le nom doit être compris entre 3 et 30 caractères.',
                    },
                },
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [3, 150],
                        msg: 'La description doit être comprise entre 3 et 150 caractères.',
                    },
                },
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('services');
    }
};