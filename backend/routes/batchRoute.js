const batchRoute = require('./router');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

const { newBatch, getBatch } = require('../controllers/batchController');

batchRoute.route('/admin/batch/new').post(isAuthenticated, authorizeRoles('admin'), newBatch);
batchRoute.route('/admin/batch').get(isAuthenticated, authorizeRoles('admin'), getBatch);

module.exports = batchRoute;