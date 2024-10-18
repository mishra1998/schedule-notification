/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('bank', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    public_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    branch: { type: DataTypes.STRING },
    nominees: {
      type: DataTypes.JSON,
    },
    owner_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ifsc: { type: DataTypes.STRING },
    balance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    currency: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    info: { type: DataTypes.JSON },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('bank'),
};
