const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage configuration for Cloudinary
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hlssa/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  }
});

// Video storage configuration for Cloudinary
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hlssa/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi'],
  }
});

module.exports = { cloudinary, imageStorage, videoStorage };