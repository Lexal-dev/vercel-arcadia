'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('habitats', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });

    await queryInterface.addColumn('animals', 'habitatId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'habitats',
        key: 'id',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('animals', 'habitatId');
    await queryInterface.dropTable('habitats');
  }
};