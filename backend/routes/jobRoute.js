const jobRoute = require('./router');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

const { newJob, deleteJob, editJob, getJob } = require('../controllers/jobController');

jobRoute.route('/admin/job/new').post(isAuthenticated, authorizeRoles('admin'), newJob);
jobRoute.route('/admin/job/update').put(isAuthenticated, authorizeRoles('admin'), editJob);
jobRoute.route('/admin/job/delete').delete(isAuthenticated, authorizeRoles('admin'), deleteJob);
jobRoute.route('/job').get(getJob);

module.exports = jobRoute;