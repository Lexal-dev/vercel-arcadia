'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hours', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      days: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Les jours ne peuvent pas être vides.',
          },
        },
      },
      open: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Le champ "morning" ne peut pas être vide.',
          },
        },
      },
      close: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Le champ "afternoon" ne peut pas être vide.',
          },
        },
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('hours');
  },
};