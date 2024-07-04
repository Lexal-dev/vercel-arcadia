'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('reports', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            details: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [3, 500],
                        msg: 'Les détails du rapport doivent contenir entre 3 et 500 caractères.'
                    }
                }
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Nom de la table users
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            animalId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'animals', // Nom de la table animals
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('reports');
    }
};