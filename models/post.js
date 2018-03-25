module.exports = function(sequelize, DataTypes) {
  const Post = sequelize.define('post', {
    postText: DataTypes.TEXT
  },
  {
    timestamps: false
  });

  Post.associate = function(models) {
    Post.belongsTo(models.user, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
    Post.belongsTo(models.game, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };
  return Post;
};
