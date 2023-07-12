const multer = require('multer');
const fs = require('fs');
const logger = require("../config/logger");
const config = require('../config/config');
const {v2: cloudinary} = require("cloudinary");
const {CloudinaryStorage} = require("multer-storage-cloudinary");


class MediaHandler {

    pathStorage = async (req, res) => {
        try {
            const storage = multer.diskStorage({
                destination: function (req, file, callback) {
                    const destPath = req.uploadPath;
                    if (!fs.existsSync(destPath))
                        fs.mkdirSync(destPath);
                    callback(null, destPath);
                },
                filename: function (req, file, callback) {
                    const parts = file.originalname.split(".");
                    const extension = parts[parts.length - 1];
                    let fileName = file.fieldname + '-' + Date.now();
                    if (extension === 'png' || extension === 'jpeg' || extension === 'jpg')
                        fileName += '.' + extension;

                    callback(null, fileName);
                }
            });
            return multer({storage: storage});
        } catch (err) {
            console.log(err);
            logger.error(err);
            return false;
        }
    }

    cloudinaryUpload = async (file, callback, folder) => {
        try {
            //instantiate cloudinary setup
            cloudinary.config({
                cloud_name: config.cloudinary.cloudName || process.env.CLOUDINARY_CLOUD_NAME,
                api_key: config.cloudinary.cloudApiKey || process.env.CLOUDINARY_API_KEY,
                api_secret: config.cloudinary.cloudApiSecret || process.env.CLOUDINARY_API_SECRET
            });

            //optimize image on upload
            let filename = function (file, callback) {
                const parts = file.originalname.split(".");
                const extension = parts[parts.length - 1];
                let fileName = file.originalname;
                callback(null, fileName);
            }
            const storage = new CloudinaryStorage({
                cloudinary: cloudinary,
                params: {
                    folder: folder || 'media-uploads',
                    use_filename: true,
                    unique_filename: true,
                    public_id: filename,
                    //optimize file upload
                    transformation: {
                        quality: "auto",
                        fetch_format: "auto"
                    }
                },
            });
            // Set up multer instance.
            // Limit is by default set to 1mb but using the limit property we can set it to 10MB
            return multer({storage: storage, limits: {fileSize: 10 * 1024 * 1024}});
        } catch (err) {
            console.log(err);
            logger.error(err);
            return false;
        }
    }

    cloudinaryDelete = async (public_id) => {
        try {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            //logic here
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    //provide logic if additional upload method exist
}

module.exports = MediaHandler;
