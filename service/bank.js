const { v1: uuidV1 } = require('uuid');
const { bank: BankModel, sequelize } = require('../models');
const Helper = require('../utils/helper');

const save = async (data) => {
  try {
    const { accountNumber, userId } = data;

    const existingBank = await BankModel.findOne({ where: { account_number: accountNumber } });

    if (existingBank) {
      return { errors: [ { name: 'Bank', message: 'Account number already exists!' } ] };
    }

    const publicId = uuidV1();

    const bankDoc = Helper.convertCamelToSnake({
      ...data, publicId, userId, created_by: userId,
    });

    await BankModel.create(bankDoc);

    return { doc: { publicId, message: 'successfully saved.' } };
  } catch (error) {
    return { err: error.message };
  }
};

const getAll = async (payload) => {
  const { userId } = payload;

  const response = await BankModel.findAll({
    attributes: { exclude: [ 'id' ] },
    where: { user_id: userId },
  });

  if (response) {
    const doc = response.map((element) => Helper.convertSnakeToCamel(element.dataValues));

    return { count: doc.length, doc };
  }

  return { count: 0, doc: [] };
};

const getDetailById = async (payload) => {
  const { publicId } = payload;

  const response = await BankModel.findOne({
    attributes: { exclude: [ 'id' ] },
    where: { public_id: publicId },
  });

  if (response) {
    return { doc: Helper.convertSnakeToCamel(response.dataValues) };
  }

  return { };
};

const patch = async (payload) => {
  const { publicId, ...newDoc } = payload;

  const transaction = await sequelize.transaction();

  try {
    const response = await BankModel.findOne({ where: { public_id: publicId } });

    if (response) {
      const doc = Helper.convertCamelToSnake(newDoc);

      await BankModel.update(doc, { where: { public_id: publicId }, transaction });

      await transaction.commit();

      return { doc: { message: 'successfully updated.', publicId } };
    }
    await transaction.rollback();

    return { errors: [ { name: 'Bank', message: 'no record found.' } ] };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = {
  save, getAll, getDetailById, patch,
};
