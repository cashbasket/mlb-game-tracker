module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    url: DataTypes.STRING
  },
  {
    timestamps: false
  });

  User.associate = function(models) {
    User.belongsTo(models.team, {
      foreignKey: {
        allowNull: true
      },
      onDelete: 'SET NULL'
    });
    
    User.hasMany(models.post);
  };

  return User;
};
