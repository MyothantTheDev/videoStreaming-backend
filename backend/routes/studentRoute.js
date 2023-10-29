const userRoute = require('./router');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

const { getStudents, newStudents, updateStudents, deleteStudents } = require('../controllers/studentControllers');

userRoute.route('/admin/students').get(isAuthenticated, authorizeRoles('admin'), getStudents);
userRoute.route('/admin/students').delete(isAuthenticated, authorizeRoles('admin'), deleteStudents);
userRoute.route('/admin/student/new').post(isAuthenticated, authorizeRoles('admin'), newStudents);
userRoute.route('/admin/student/update').put(isAuthenticated, authorizeRoles('admin'), updateStudents);

module.exports = userRoute;