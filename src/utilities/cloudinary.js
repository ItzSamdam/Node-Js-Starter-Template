//upload image to cloudinary server
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//optimize image on upload
let filename = function(file, callback){
    const parts = file.originalname.split(".");
    const extension = parts[parts.length - 1];
    let fileName = file.originalname;
    callback(null, fileName);
}
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "DEV",
        use_filename: true,
        unique_filename: true,
        public_id: filename,
        transformation: {
            quality: "auto",
            fetch_format: "auto"
        }
    },
});

// Set up multer instance.
// Limit is by default set to 1mb but using the limit property we can set it to 10MB
const cloudinaryUpload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = {cloudinaryUpload};