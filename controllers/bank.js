const BankService = require('../service/bank');
const Validator = require('../utils/validator');
const { save: saveSchema, getDetails: getDetailsSchema, patch: patchSchema } = require('../dto-schemas/bank');

const save = async (req, res) => {
  try {
    const { body, auth: { userId } } = req;
    const { errors, data } = Validator.isSchemaValid({ data: { ...body, userId }, schema: saveSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await BankService.save(data);

    if (doc) {
      const { publicId } = doc;

      res.setHeader('public-id', publicId);

      res.setHeader('message', 'successfully saved.');

      return res.status(201).json({ status: 'success', message: 'successfully saved.' });
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const { auth: { userId } } = req;

    const { count, doc } = await BankService.getAll({ userId });

    res.setHeader('x-coreplatform-paging-limit', count);
    res.setHeader('x-coreplatform-total-records', count);

    return res.status(200).json(doc);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const getDetailById = async (req, res) => {
  try {
    const { params: { publicId } } = req;

    const data = { publicId };

    const { errors } = Validator.isSchemaValid({ data, schema: getDetailsSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { doc } = await BankService.getDetailById(data);

    if (doc) {
      return res.status(200).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const patch = async (req, res) => {
  try {
    const {
      body, auth: { userId }, params: { publicId },
    } = req;

    const { errors, data } = Validator.isSchemaValid({
      data: { ...body, publicId, updatedBy: userId },
      schema: patchSchema,
    });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await BankService.patch(data);

    if (err) {
      return res.badRequest('field-validation', err);
    }

    if (doc) {
      res.setHeader('message', 'successfully updated.');

      return res.status(200).json({ status: 'success', message: 'successfully updated.' });
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = {
  save, getAll, getDetailById, patch,
};
