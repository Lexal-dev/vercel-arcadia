'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('avis', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            pseudo: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [3, 30],
                        msg: 'Le pseudo doit être compris entre 3 et 30 caractères.',
                    },
                },
            },
            comment: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [3, 150],
                        msg: 'Le commentaire doit être compris entre 3 et 150 caractères.',
                    },
                },
            },
            isValid: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('avis');
    }
};