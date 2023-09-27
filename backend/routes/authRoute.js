const authRoute = require('./router');
const { isAuthenticated } = require('../middleware/auth');

const { loginUser,logoutUser } = require('../controllers/authController');

authRoute.route('/login').post(loginUser);
authRoute.route('/logout').get(isAuthenticated, logoutUser);

module.exports = authRoute;