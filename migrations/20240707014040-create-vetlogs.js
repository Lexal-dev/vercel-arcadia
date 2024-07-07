'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('vetLogs', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            animalState: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            foodOffered: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            foodWeight: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            animalId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'animals',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('vetLogs');
    },
};