import { v2 as cloudinary } from 'cloudinary';

const cloudinaryInfo = cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY // Click 'View API Keys' above to copy your API secret
});
module.exports = cloudinaryInfo;