module.exports = function(sequelize, DataTypes) {
  const Comment = sequelize.define('comment', {
    commentText: { type: DataTypes.TEXT, allowNull: false},
    commentDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false
  });

  Comment.associate = function(models) {
    Comment.belongsTo(models.user, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.post, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};