const {
  save, getDetailById, patch, getAll,
} = require('../controllers/bank');

module.exports = (router) => {
  router.post('/bank', save);
  router.get('/bank', getAll);
  router.get('/bank/:publicId', getDetailById);
  router.patch('/bank/:publicId', patch);
};
