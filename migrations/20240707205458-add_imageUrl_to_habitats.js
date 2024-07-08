'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('habitats', 'imageUrl', {
      type: Sequelize.ARRAY(Sequelize.STRING), // Définition du type ARRAY de STRING
      allowNull: true, // Optionnel, dépend de vos besoins
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('habitats', 'imageUrl');
  }
};