const CaseStatusService = require('../service/case-status');

const registerToken = async (req, res) => {
  try {
    const { registrationToken } = req.body;

    if (!registrationToken) {
      return res.status(400).json({ status: 'error', message: 'Registration token is required' });
    }

    const { errors: err, doc } = await CaseStatusService.registerToken(registrationToken);

    if (doc) {
      res.setHeader('message', 'successfully updated.');

      return res.status(200).json({ status: 'success', message: 'successfully updated.' });
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const submitReceipt = async (req, res) => {
  try {
    const { receiptNumber, registrationToken } = req.body;

    if (!receiptNumber || !registrationToken) {
      return res.status(400).json({ status: 'error', message: 'Receipt number and registration token are required' });
    }

    const {
      caseStatus, message, publicId, errors,
    } = await CaseStatusService.submitReceipt(receiptNumber, registrationToken);

    if (errors) {
      return res.status(400).json({ status: 'error', message: errors[0].message });
    }

    return res.status(201).json({
      status: 'success', caseStatus, publicId, message,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = { registerToken, submitReceipt };
