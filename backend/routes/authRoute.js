const authRoute = require('./router');
const { isAuthenticated } = require('../middleware/auth');

const { loginUser,logoutUser,getUser } = require('../controllers/authController');

authRoute.route('/login').post(loginUser);
authRoute.route('/logout').get(isAuthenticated, logoutUser);
authRoute.route('/me').get(isAuthenticated, getUser);

module.exports = authRoute;