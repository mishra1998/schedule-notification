const { registerToken, submitReceipt } = require('../controllers/case-status');

module.exports = (router) => {
  router.post('/register-token', registerToken);
  router.post('/submit-receipt', submitReceipt);
};
