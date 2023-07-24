import multer, { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { error } from "../config/logger";
import { cloudinary as _cloudinary } from '../config/config';
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


class MediaHandler {

    pathStorage = async (req, res) => {
        try {
            const storage = diskStorage({
                destination: function (req, file, callback) {
                    const destPath = req.uploadPath;
                    if (!existsSync(destPath))
                        mkdirSync(destPath);
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
            error(err);
            return false;
        }
    }

    cloudinaryUpload = async (file, callback, folder) => {
        try {
            //instantiate cloudinary setup
            cloudinary.config({
                cloud_name: _cloudinary.cloudName || process.env.CLOUDINARY_CLOUD_NAME,
                api_key: _cloudinary.cloudApiKey || process.env.CLOUDINARY_API_KEY,
                api_secret: _cloudinary.cloudApiSecret || process.env.CLOUDINARY_API_SECRET
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
            error(err);
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
            error(err);
            return false;
        }
    }

    //provide logic if additional upload method exist
}

export default MediaHandler;
