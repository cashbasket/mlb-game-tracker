module.exports = function(sequelize, DataTypes) {
  const Attendance = sequelize.define('attendance', { 
    seat: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    freezeTableName: true,
    timestamps: false
  });

  Attendance.associate = function(models) {
    Attendance.belongsTo(models.user, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
    Attendance.belongsTo(models.game, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };
  return Attendance;
};
