const { registerToken, submitReceipt, getDetailByRegistrationToken } = require('../controllers/case-status');

module.exports = (router) => {
  router.post('/register-token', registerToken);
  router.post('/submit-receipt', submitReceipt);
  router.get('/status-history/:registrationToken', getDetailByRegistrationToken);
};
