module.exports = function(sequelize, DataTypes) {
  const Game = sequelize.define('game', {
    season: { type: DataTypes.STRING,
      allowNull: false
    },
    gameDate: { type: DataTypes.DATEONLY,
      allowNull: false
    },
    gameTime: { type: DataTypes.TIME,
      allowNull: false
    },
    awayTeamScore: DataTypes.INTEGER,
    homeTeamScore: DataTypes.INTEGER
  },
  {
    timestamps: false
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

    // Game.belongsTo(models.team, {
    //   as: 'Winner',
    //   foreignKey: {
    //     name: 'winningTeamId',
    //     allowNull: true
    //   },
    //   onDelete: 'SET NULL'
    // });

    Game.belongsTo(models.venue, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  return Game;
};
