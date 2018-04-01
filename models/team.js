module.exports = function(sequelize, DataTypes) {
  const Team = sequelize.define('team', {
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    abbr: DataTypes.STRING,
    url: DataTypes.STRING,
    logo: DataTypes.STRING,
    league: DataTypes.STRING,
    division: DataTypes.STRING,
    manager: DataTypes.STRING,
    established: DataTypes.INTEGER
  },
  {
    timestamps: false
  });

  Team.associate = function(models) {    
    Team.belongsTo(models.venue, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
    Team.hasMany(models.game, {
      foreignKey: 'awayTeamId',
      as: 'Away'
    });
    Team.hasMany(models.game, {
      foreignKey: 'homeTeamId',
      as: 'Home'
    });
    Team.hasMany(models.game, {
      foreignKey: 'winningTeamId',
      as: 'Winner'
    });
    Team.hasMany(models.game, {
      foreignKey: 'losingTeamId',
      as: 'Loser'
    });
    Team.hasMany(models.user);
  };

  return Team;
};
