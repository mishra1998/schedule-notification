module.exports = (sequelize, DataTypes) => {
  const userDevice = sequelize.define('user_device', {
    public_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    receipt_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registration_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
  }, {
    freezeTableName: true,
    underscored: true,
    timestamps: true,
  });

  return userDevice;
};
