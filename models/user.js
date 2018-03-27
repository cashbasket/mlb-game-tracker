var bcrypt = require('bcrypt-nodejs');
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gravatar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    tokenExpires: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null
    },
    url: {
      type: DataTypes.STRING,
      defaultValue: null
    }
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
    User.hasMany(models.attendance);
  };

  User.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    delete values.password;
    delete values.token;
    delete values.tokenExpires;
    return values;
  };
	
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
