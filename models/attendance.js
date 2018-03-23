module.exports = function(sequelize, DataTypes) {
  const Attendance = sequelize.define('attendance', { /* bla */ }, {
    freezeTableName: true
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
