module.exports = function(sequelize, DataTypes) {
  const Game = sequelize.define('game', {
    gameDate: { type: DataTypes.DATE,
      allowNull: false
    },
    gameTime: { type: DataTypes.DATE,
      allowNull: false
    }
  });

  Game.associate = function(models) {    

    Game.belongsTo(models.team, {
      as: 'Away',
      foreignKey: {
        name: 'awayTeamId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });

    Game.belongsTo(models.team, {
      as: 'Home',
      foreignKey: {
        name: 'homeTeamId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });

    Game.belongsTo(models.team, {
      as: 'Winner',
      foreignKey: {
        name: 'winningTeamId',
        allowNull: true
      },
      onDelete: 'SET NULL'
    });

    Game.belongsTo(models.venue, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  return Game;
};
