import {v2 as cloudinary} from 'cloudinary'
import multer from 'multer'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import configuration from './config'
import { Request } from 'express';

//configure cloudinary
cloudinary.config({
    cloud_name: configuration.cloudinary.cloud_name,
    api_key: configuration.cloudinary.api_key,
    api_secret: configuration.cloudinary.api_secret,
});

//setup cloudinary storage for profile images
const profileImageStorage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params: async (req:Request, file: Express.Multer.File) => {
        const timestamp = Date.now();
        const fileName = file.originalname.split(".")[0];

        return {
            folder: "futurify",
            public_id: `${fileName}-${timestamp}`,
            resource_type: "image",
        }
    }
});

//configure multer with cloudinary storage
const uploadProfileImage = multer({
    storage: profileImageStorage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter:(
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFiles:boolean)=> void

    ) => {
        const allowedImageTypes =/image\/(jpeg|png|jpg)/
        if(!allowedImageTypes.test(file.mimetype)){
            return cb(
                new Error("Only image are allowed in JPG, JPEG, AND PNG"),
                false,
            )
        }else {
            cb(null, true)
        }
    }
})

export const uploadCloudinaryProfileImage = uploadProfileImage.single("profileImage")