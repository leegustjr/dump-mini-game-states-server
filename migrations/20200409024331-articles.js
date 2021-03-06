module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Articles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contents: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    likes: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    dislikes: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('articles'),
};
