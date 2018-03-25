module.exports = function(sequelize, DataTypes) {
  const Venue = sequelize.define('venue', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    country: DataTypes.STRING,
    stadiumType: DataTypes.STRING,
    surface: DataTypes.STRING,
    dimensions: DataTypes.STRING
  },
  {
    timestamps: false
  });

  Venue.associate = function(models) {    
    Venue.hasMany(models.game);
    Venue.hasMany(models.team);
  };

  return Venue;
};
