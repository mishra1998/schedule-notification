/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('bank', {
    // Description: Primary key for the table, auto-incrementing integer.
    // Purpose: Uniquely identifies each bank record.
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    // Description: UUID used for public identification of a bank record.
    // Purpose: Uniquely identifies the bank entity in a public-facing system while concealing the internal database ID.
    public_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    // Description: UUID representing the user who owns this bank account.
    // Purpose: Links the bank account to a specific user in the system.
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // Description: The name of the bank.
    // Purpose: Stores the bank's name, which is essential for identifying the bank entity.
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Description: A unique code for the bank (bank code).
    // Purpose: Stores bank-specific codes such as branch codes or bank identification codes.
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Description: The bank account number.
    // Purpose: Stores the unique account number associated with the user's bank account.
    account_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    // Description: Name or code of the bank branch.
    // Purpose: Stores information about the specific branch of the bank where the account is held.
    branch: { type: DataTypes.STRING },
    // Description: JSON object storing details of nominees associated with the account.
    // Purpose: Allows for storing multiple nominee details in a structured format, often used for beneficiary purposes.
    nominees: {
      type: DataTypes.JSON,
    },
    // Description: Name of the account holder.
    // Purpose: Stores the name of the individual or entity that owns the bank account.
    owner_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Description: IFSC (Indian Financial System Code) for the bank branch.
    // Purpose: Identifies the specific bank branch in the Indian banking system (applicable for India).
    ifsc: { type: DataTypes.STRING },
    // Description: The balance in the bank account.
    // Purpose: Stores the current balance of the user's bank account, defaulting to 0.00
    balance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    // Description: The currency type of the account.
    // Purpose: Stores the currency (e.g., USD, INR) in which the account balance is maintained.
    currency: { type: DataTypes.STRING },
    // Description: The country where the bank account is held.
    // Purpose: Stores the country information for the bank account, useful for international bank records.
    country: { type: DataTypes.STRING },
    // Description: JSON object for additional information or metadata about the bank account.
    // Purpose: Allows for flexible storage of extra details that may not fit into predefined fields.
    info: { type: DataTypes.JSON },
    // Description: UUID representing the user who created the bank record.
    // Purpose: Tracks which user or entity created this record for auditing purposes.
    created_by: { type: DataTypes.UUID },
    // Description: UUID representing the user who last updated the bank record.
    // Purpose: Tracks who made the most recent updates to the bank record, also for auditing purposes.
    updated_by: { type: DataTypes.UUID },
    // Description: Timestamp of when the record was created.
    // Purpose: Automatically logs the creation date and time for record-keeping.
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // Description: Timestamp of when the record was last updated.
    // Purpose: Automatically logs the last updated date and time, essential for maintaining up-to-date records.
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('bank'),
};
