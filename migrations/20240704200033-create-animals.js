'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('animals', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [3, 30],
            msg: 'Le nom doit être compris entre [3 - 30] caractères',
          },
        },
      },
      etat: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 100],
            msg: "Le message d'état doit être compris entre [3 - 100] caractères",
          },
        },
      },
      raceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'races',
          key: 'id',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('animals');
  },
};