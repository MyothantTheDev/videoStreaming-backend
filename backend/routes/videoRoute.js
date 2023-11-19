const videoRouter = require('./router');
const { newVideo, getVideo, updateVideo, deleteVideo, streamVideo, combineVideo } = require('../controllers/videoController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/storage');

videoRouter.route('/video/new').post(isAuthenticated, authorizeRoles('admin'), upload.array('file'),newVideo);
videoRouter.route('/video').get(isAuthenticated, authorizeRoles('admin', 'user'),getVideo);
videoRouter.route('/video/delete').delete(isAuthenticated, authorizeRoles('admin'), deleteVideo);
videoRouter.route('/video/update').put(isAuthenticated, authorizeRoles('admin'), upload.single('file'),updateVideo);
videoRouter.route('/video/stream').get(isAuthenticated, authorizeRoles('admin','user'), streamVideo);
videoRouter.route('/video/combine').post(isAuthenticated, authorizeRoles('admin'), combineVideo);

module.exports = videoRouter;