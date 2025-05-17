const multer = require('multer');
const { imageStorage } = require('../utils/cloudinary');
const upload = multer({ storage: imageStorage });
module.exports = upload;
