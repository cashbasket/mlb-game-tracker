module.exports = function(sequelize, DataTypes) {
  const Post = sequelize.define('post', {
    postText: { type: DataTypes.TEXT, allowNull: false},
    postDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
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
