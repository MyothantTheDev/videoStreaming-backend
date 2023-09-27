const videoRouter = require('./router');
const { newVideo, getVideo, updateVideo, deleteVideo } = require('../controllers/videoController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/storage');

videoRouter.route('/video/new').post(isAuthenticated, authorizeRoles('admin'), upload.array('file'),newVideo);
videoRouter.route('/video').get(isAuthenticated, authorizeRoles('admin', 'user'),getVideo);
videoRouter.route('/video/delete').delete(isAuthenticated, authorizeRoles('admin'), deleteVideo);
videoRouter.route('/video/update').put(isAuthenticated, authorizeRoles('admin'), upload.single('file'),updateVideo);

module.exports = videoRouter;